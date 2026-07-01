import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TMDB_API_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
const POSTER_SIZE = "w500";
const BACKDROP_SIZE = "w1280";
const PROFILE_SIZE = "w300";

function getEnv(key: string): string {
  const v = Deno.env.get(key);
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
}

function supabaseClient() {
  return createClient(
    getEnv("SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } }
  );
}

async function tmdbFetch(path: string, apiKey: string, params: Record<string, string> = {}): Promise<any> {
  const url = new URL(`${TMDB_API_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`TMDb ${res.status}: ${body}`);
  }
  return res.json();
}

function posterUrl(path: string | null): string | null {
  return path ? `${TMDB_IMAGE_BASE}/${POSTER_SIZE}${path}` : null;
}

function backdropUrl(path: string | null): string | null {
  return path ? `${TMDB_IMAGE_BASE}/${BACKDROP_SIZE}${path}` : null;
}

function profileUrl(path: string | null): string | null {
  return path ? `${TMDB_IMAGE_BASE}/${PROFILE_SIZE}${path}` : null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

// ============ GENRE SYNC ============

const TMDB_MOVIE_GENRES: Record<number, { name_en: string; name_fa: string }> = {
  28: { name_en: "Action", name_fa: "اکشن" },
  12: { name_en: "Adventure", name_fa: "ماجراجویی" },
  16: { name_en: "Animation", name_fa: "انیمیشن" },
  35: { name_en: "Comedy", name_fa: "کمدی" },
  80: { name_en: "Crime", name_fa: "جنایی" },
  99: { name_en: "Documentary", name_fa: "مستند" },
  18: { name_en: "Drama", name_fa: "درام" },
  10751: { name_en: "Family", name_fa: "خانوادگی" },
  14: { name_en: "Fantasy", name_fa: "فانتزی" },
  36: { name_en: "History", name_fa: "تاریخی" },
  27: { name_en: "Horror", name_fa: "ترسناک" },
  10402: { name_en: "Music", name_fa: "موزیک" },
  9648: { name_en: "Mystery", name_fa: "معمایی" },
  10749: { name_en: "Romance", name_fa: "عاشقانه" },
  878: { name_en: "Sci-Fi", name_fa: "علمی-تخیلی" },
  53: { name_en: "Thriller", name_fa: "هیجان‌انگیز" },
  10752: { name_en: "War", name_fa: "جنگی" },
  37: { name_en: "Western", name_fa: "وسترن" },
};

const TMDB_TV_GENRES: Record<number, { name_en: string; name_fa: string }> = {
  ...TMDB_MOVIE_GENRES,
  10759: { name_en: "Action & Adventure", name_fa: "اکشن و ماجراجویی" },
  10762: { name_en: "Kids", name_fa: "کودکان" },
  10763: { name_en: "News", name_fa: "اخبار" },
  10764: { name_en: "Reality", name_fa: "رئالیتی" },
  10765: { name_en: "Sci-Fi & Fantasy", name_fa: "علمی-تخیلی و فانتزی" },
  10766: { name_en: "Soap", name_fa: "صابون" },
  10767: { name_en: "Talk", name_fa: "گفتگو" },
  10768: { name_en: "War & Politics", name_fa: "جنگ و سیاست" },
};

async function syncGenres(supabase: any, apiKey: string): Promise<Record<number, string>> {
  // Fetch movie genres from TMDb
  const movieGenres = await tmdbFetch("/genre/movie/list", apiKey);
  const tvGenres = await tmdbFetch("/genre/tv/list", apiKey);

  const genreMap: Record<number, string> = {};
  const allGenres = [...(movieGenres.genres || []), ...(tvGenres.genres || [])];

  for (const g of allGenres) {
    const meta = TMDB_MOVIE_GENRES[g.id] || TMDB_TV_GENRES[g.id] || { name_en: g.name, name_fa: g.name };
    const slug = slugify(meta.name_en);

    // Upsert genre
    const { data } = await supabase
      .from("genres")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    let genreId: string;
    if (data) {
      genreId = data.id;
    } else {
      const { data: inserted } = await supabase
        .from("genres")
        .insert({ name_en: meta.name_en, name_fa: meta.name_fa, slug })
        .select("id")
        .single();
      genreId = inserted.id;
    }
    genreMap[g.id] = genreId;
  }

  return genreMap;
}

// ============ PERSON SYNC ============

async function syncPerson(supabase: any, apiKey: string, personId: number, role: "actor" | "director"): Promise<string | null> {
  const table = role === "actor" ? "actors" : "directors";

  // Check if already imported
  const { data: existing } = await supabase
    .from(table)
    .select("id")
    .eq("tmdb_id", personId)
    .maybeSingle();
  if (existing) return existing.id;

  try {
    const person = await tmdbFetch(`/person/${personId}`, apiKey);
    if (!person || person.id !== personId) return null;

    const insertData: any = {
      tmdb_id: person.id,
      name: person.name || "Unknown",
      name_fa: null,
      photo_url: profileUrl(person.profile_path),
      bio: person.biography || null,
      bio_fa: null,
      birth_date: person.birthday || null,
      nationality: person.place_of_birth || null,
    };

    const { data: inserted, error } = await supabase
      .from(table)
      .insert(insertData)
      .select("id")
      .single();

    if (error) {
      // Maybe inserted by concurrent request
      const { data: retry } = await supabase.from(table).select("id").eq("tmdb_id", personId).maybeSingle();
      return retry?.id || null;
    }
    return inserted.id;
  } catch {
    return null;
  }
}

// ============ MOVIE IMPORT ============

async function importMovie(supabase: any, apiKey: string, tmdbId: number, genreMap: Record<number, string>): Promise<string | null> {
  // Check if already imported
  const { data: existing } = await supabase
    .from("movies")
    .select("id")
    .eq("tmdb_id", tmdbId)
    .maybeSingle();
  if (existing) return existing.id;

  try {
    const movie = await tmdbFetch(`/movie/${tmdbId}`, apiKey, {
      append_to_response: "credits,videos,images",
    });
    if (!movie || !movie.id) return null;

    const slug = slugify(movie.title || movie.original_title || `movie-${tmdbId}`);

    // Ensure slug uniqueness
    const { data: slugCheck } = await supabase.from("movies").select("id").eq("slug", slug).maybeSingle();
    const finalSlug = slugCheck ? `${slug}-${tmdbId}` : slug;

    // Find director
    let directorId: string | null = null;
    const director = (movie.credits?.crew || []).find((c: any) => c.job === "Director");
    if (director) {
      directorId = await syncPerson(supabase, apiKey, director.id, "director");
    }

    // Find trailer
    const trailer = (movie.videos?.results || []).find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube"
    );
    const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

    const insertData = {
      tmdb_id: movie.id,
      title_en: movie.title || movie.original_title || "Unknown",
      title_fa: null,
      slug: finalSlug,
      description_en: movie.overview || null,
      description_fa: null,
      poster_url: posterUrl(movie.poster_path),
      backdrop_url: backdropUrl(movie.backdrop_path),
      tmdb_poster_path: movie.poster_path,
      tmdb_backdrop_path: movie.backdrop_path,
      trailer_url: trailerUrl,
      imdb_rating: Math.round((movie.vote_average || 0) * 10) / 10,
      release_year: movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : null,
      runtime: movie.runtime || null,
      country: movie.production_countries?.[0]?.name || null,
      language: movie.original_language || "en",
      age_rating: movie.adult ? "R" : "PG-13",
      status: "published",
    };

    const { data: inserted, error } = await supabase
      .from("movies")
      .insert(insertData)
      .select("id")
      .single();

    if (error) {
      const { data: retry } = await supabase.from("movies").select("id").eq("tmdb_id", tmdbId).maybeSingle();
      return retry?.id || null;
    }
    const movieId = inserted.id;

    // Link genres
    const movieGenreIds = (movie.genres || []).map((g: any) => g.id).filter((id: number) => genreMap[id]);
    if (movieGenreIds.length > 0) {
      const genreRows = movieGenreIds.map((gid: number) => ({ movie_id: movieId, genre_id: genreMap[gid] }));
      await supabase.from("movie_genres").upsert(genreRows, { onConflict: "movie_id,genre_id", ignoreDuplicates: true });
    }

    // Link director
    if (directorId) {
      await supabase.from("movie_directors").upsert(
        { movie_id: movieId, director_id: directorId },
        { onConflict: "movie_id,director_id" }
      );
    }

    // Link top cast (up to 10)
    const cast = (movie.credits?.cast || []).slice(0, 10);
    for (const member of cast) {
      const actorId = await syncPerson(supabase, apiKey, member.id, "actor");
      if (actorId) {
        await supabase.from("movie_actors").upsert(
          { movie_id: movieId, actor_id: actorId, role_name: member.character || null },
          { onConflict: "movie_id,actor_id" }
        );
      }
    }

    // Add streaming sources (sample URLs for now)
    const sampleVideo = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    const streamQualities = ["1080p", "720p", "480p"];
    for (const q of streamQualities) {
      await supabase.from("movie_streams").upsert(
        { movie_id: movieId, quality: q, language: "en", subtitle_available: true, stream_url: sampleVideo },
        { onConflict: "movie_id,quality,language" }
      );
      await supabase.from("movie_downloads").upsert(
        { movie_id: movieId, quality: q, file_size: q === "1080p" ? "2.3 GB" : q === "720p" ? "1.1 GB" : "520 MB", language: "en", subtitle_available: true, download_url: sampleVideo },
        { onConflict: "movie_id,quality,language" }
      );
    }

    // Add subtitles
    await supabase.from("subtitles").upsert(
      { movie_id: movieId, language: "en", subtitle_url: `https://example.com/subtitles/en/${tmdbId}.vtt` },
      { onConflict: "movie_id,language" }
    );

    // Create explore clip if movie has a backdrop
    if (movie.backdrop_path) {
      await supabase.from("explore_clips").upsert({
        movie_id: movieId,
        title: `${movie.title} - Official Clip`,
        hook_text: movie.overview?.slice(0, 100) || "Watch this amazing scene",
        video_url: sampleVideo,
        thumbnail_url: backdropUrl(movie.backdrop_path) || posterUrl(movie.poster_path) || "",
        views: Math.floor(Math.random() * 2000000) + 100000,
        likes_count: Math.floor(Math.random() * 80000) + 5000,
        comments_count: Math.floor(Math.random() * 3000) + 100,
        shares_count: Math.floor(Math.random() * 15000) + 500,
        saves_count: Math.floor(Math.random() * 30000) + 1000,
        trending_score: Math.round((movie.vote_average || 7) * 10),
        status: "active",
      }, { onConflict: "movie_id" });
    }

    return movieId;
  } catch (err) {
    console.error(`Failed to import movie ${tmdbId}:`, err.message);
    return null;
  }
}

// ============ SERIES IMPORT ============

async function importSeries(supabase: any, apiKey: string, tmdbId: number, genreMap: Record<number, string>): Promise<string | null> {
  const { data: existing } = await supabase
    .from("series")
    .select("id")
    .eq("tmdb_id", tmdbId)
    .maybeSingle();
  if (existing) return existing.id;

  try {
    const series = await tmdbFetch(`/tv/${tmdbId}`, apiKey, {
      append_to_response: "credits,videos",
    });
    if (!series || !series.id) return null;

    const slug = slugify(series.name || series.original_name || `series-${tmdbId}`);
    const { data: slugCheck } = await supabase.from("series").select("id").eq("slug", slug).maybeSingle();
    const finalSlug = slugCheck ? `${slug}-${tmdbId}` : slug;

    const trailer = (series.videos?.results || []).find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube"
    );
    const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

    // Find creator
    let directorId: string | null = null;
    const creator = (series.credits?.crew || []).find((c: any) => c.job === "Director") ||
                    (series.created_by || [])[0];
    if (creator) {
      directorId = await syncPerson(supabase, apiKey, creator.id, "director");
    }

    const insertData = {
      tmdb_id: series.id,
      title_en: series.name || "Unknown",
      title_fa: null,
      slug: finalSlug,
      description_en: series.overview || null,
      description_fa: null,
      poster_url: posterUrl(series.poster_path),
      backdrop_url: backdropUrl(series.backdrop_path),
      tmdb_poster_path: series.poster_path,
      tmdb_backdrop_path: series.backdrop_path,
      trailer_url: trailerUrl,
      imdb_rating: Math.round((series.vote_average || 0) * 10) / 10,
      release_year: series.first_air_date ? parseInt(series.first_air_date.substring(0, 4)) : null,
      country: series.production_countries?.[0]?.name || null,
      language: series.original_language || "en",
      age_rating: "PG-13",
      seasons: series.number_of_seasons || 1,
      total_episodes: series.number_of_episodes || 0,
      episode_runtime: series.episode_run_time?.[0] || 45,
      status: series.status === "Ended" ? "ended" : series.status === "Returning Series" ? "ongoing" : "published",
    };

    const { data: inserted, error } = await supabase
      .from("series")
      .insert(insertData)
      .select("id")
      .single();

    if (error) {
      const { data: retry } = await supabase.from("series").select("id").eq("tmdb_id", tmdbId).maybeSingle();
      return retry?.id || null;
    }
    const seriesId = inserted.id;

    // Link genres
    const seriesGenreIds = (series.genres || []).map((g: any) => g.id).filter((id: number) => genreMap[id]);
    if (seriesGenreIds.length > 0) {
      const genreRows = seriesGenreIds.map((gid: number) => ({ series_id: seriesId, genre_id: genreMap[gid] }));
      await supabase.from("series_genres").upsert(genreRows, { onConflict: "series_id,genre_id", ignoreDuplicates: true });
    }

    // Link director/creator
    if (directorId) {
      await supabase.from("series_directors").upsert(
        { series_id: seriesId, director_id: directorId },
        { onConflict: "series_id,director_id" }
      );
    }

    // Link top cast
    const cast = (series.credits?.cast || []).slice(0, 10);
    for (const member of cast) {
      const actorId = await syncPerson(supabase, apiKey, member.id, "actor");
      if (actorId) {
        await supabase.from("series_actors").upsert(
          { series_id: seriesId, actor_id: actorId, role_name: member.character || null },
          { onConflict: "series_id,actor_id" }
        );
      }
    }

    // Import episodes for season 1
    if (series.seasons && series.seasons.length > 0) {
      const firstSeason = series.seasons.find((s: any) => s.season_number > 0) || series.seasons[0];
      if (firstSeason && firstSeason.season_number > 0) {
        try {
          const seasonData = await tmdbFetch(`/tv/${tmdbId}/season/${firstSeason.season_number}`, apiKey);
          if (seasonData.episodes) {
            const episodeRows = seasonData.episodes.slice(0, 10).map((ep: any) => ({
              series_id: seriesId,
              season_number: ep.season_number,
              episode_number: ep.episode_number,
              title_en: ep.name || `Episode ${ep.episode_number}`,
              title_fa: null,
              description_en: ep.overview || null,
              description_fa: null,
              duration: series.episode_run_time?.[0] || 45,
              thumbnail_url: ep.still_path ? `${TMDB_IMAGE_BASE}/w400${ep.still_path}` : null,
              air_date: ep.air_date || null,
            }));
            if (episodeRows.length > 0) {
              await supabase.from("episodes").upsert(episodeRows, { onConflict: "series_id,season_number,episode_number" });
            }
          }
        } catch { /* season fetch may fail, skip */
        }
      }
    }

    return seriesId;
  } catch (err) {
    console.error(`Failed to import series ${tmdbId}:`, err.message);
    return null;
  }
}

// ============ BULK IMPORT ============

async function importPopularMovies(supabase: any, apiKey: string, genreMap: Record<number, string>, pages: number): Promise<{ imported: number; failed: number }> {
  let imported = 0;
  let failed = 0;

  for (let page = 1; page <= pages; page++) {
    try {
      const data = await tmdbFetch("/movie/popular", apiKey, { page: String(page) });
      const results = data.results || [];

      for (const item of results) {
        const id = await importMovie(supabase, apiKey, item.id, genreMap);
        if (id) imported++;
        else failed++;
      }
    } catch (err) {
      console.error(`Failed to fetch popular movies page ${page}:`, err.message);
    }
  }

  return { imported, failed };
}

async function importTopRatedMovies(supabase: any, apiKey: string, genreMap: Record<number, string>, pages: number): Promise<{ imported: number; failed: number }> {
  let imported = 0;
  let failed = 0;

  for (let page = 1; page <= pages; page++) {
    try {
      const data = await tmdbFetch("/movie/top_rated", apiKey, { page: String(page) });
      const results = data.results || [];

      for (const item of results) {
        const id = await importMovie(supabase, apiKey, item.id, genreMap);
        if (id) imported++;
        else failed++;
      }
    } catch (err) {
      console.error(`Failed to fetch top rated movies page ${page}:`, err.message);
    }
  }

  return { imported, failed };
}

async function importPopularSeries(supabase: any, apiKey: string, genreMap: Record<number, string>, pages: number): Promise<{ imported: number; failed: number }> {
  let imported = 0;
  let failed = 0;

  for (let page = 1; page <= pages; page++) {
    try {
      const data = await tmdbFetch("/tv/popular", apiKey, { page: String(page) });
      const results = data.results || [];

      for (const item of results) {
        const id = await importSeries(supabase, apiKey, item.id, genreMap);
        if (id) imported++;
        else failed++;
      }
    } catch (err) {
      console.error(`Failed to fetch popular series page ${page}:`, err.message);
    }
  }

  return { imported, failed };
}

async function importTopRatedSeries(supabase: any, apiKey: string, genreMap: Record<number, string>, pages: number): Promise<{ imported: number; failed: number }> {
  let imported = 0;
  let failed = 0;

  for (let page = 1; page <= pages; page++) {
    try {
      const data = await tmdbFetch("/tv/top_rated", apiKey, { page: String(page) });
      const results = data.results || [];

      for (const item of results) {
        const id = await importSeries(supabase, apiKey, item.id, genreMap);
        if (id) imported++;
        else failed++;
      }
    } catch (err) {
      console.error(`Failed to fetch top rated series page ${page}:`, err.message);
    }
  }

  return { imported, failed };
}

// ============ MAIN HANDLER ============

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("TMDB_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "TMDB_API_KEY secret not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = supabaseClient();
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "sync_all";

    let result: any = { action };

    // Always sync genres first
    const genreMap = await syncGenres(supabase, apiKey);
    result.genresSynced = Object.keys(genreMap).length;

    if (action === "sync_all") {
      // Import popular + top rated movies (3 pages each = ~120 movies, but many will dedupe)
      const popularMovies = await importPopularMovies(supabase, apiKey, genreMap, 3);
      const topRatedMovies = await importTopRatedMovies(supabase, apiKey, genreMap, 2);
      const popularSeries = await importPopularSeries(supabase, apiKey, genreMap, 2);
      const topRatedSeries = await importTopRatedSeries(supabase, apiKey, genreMap, 2);

      result.movies = {
        popular: popularMovies,
        topRated: topRatedMovies,
        totalImported: popularMovies.imported + topRatedMovies.imported,
      };
      result.series = {
        popular: popularSeries,
        topRated: topRatedSeries,
        totalImported: popularSeries.imported + topRatedSeries.imported,
      };
    } else if (action === "sync_movies") {
      const pages = parseInt(url.searchParams.get("pages") || "3");
      const popular = await importPopularMovies(supabase, apiKey, genreMap, pages);
      const topRated = await importTopRatedMovies(supabase, apiKey, genreMap, Math.max(1, Math.floor(pages * 0.7)));
      result.movies = { popular, topRated, totalImported: popular.imported + topRated.imported };
    } else if (action === "sync_series") {
      const pages = parseInt(url.searchParams.get("pages") || "2");
      const popular = await importPopularSeries(supabase, apiKey, genreMap, pages);
      const topRated = await importTopRatedSeries(supabase, apiKey, genreMap, Math.max(1, Math.floor(pages * 0.7)));
      result.series = { popular, topRated, totalImported: popular.imported + topRated.imported };
    } else if (action === "import_movie") {
      const tmdbId = parseInt(url.searchParams.get("tmdb_id") || "0");
      if (!tmdbId) throw new Error("tmdb_id required for import_movie action");
      const id = await importMovie(supabase, apiKey, tmdbId, genreMap);
      result.movieId = id;
      result.success = !!id;
    } else if (action === "import_series") {
      const tmdbId = parseInt(url.searchParams.get("tmdb_id") || "0");
      if (!tmdbId) throw new Error("tmdb_id required for import_series action");
      const id = await importSeries(supabase, apiKey, tmdbId, genreMap);
      result.seriesId = id;
      result.success = !!id;
    } else if (action === "sync_genres") {
      result.genres = genreMap;
    } else {
      return new Response(JSON.stringify({ error: `Unknown action: ${action}. Valid: sync_all, sync_movies, sync_series, import_movie, import_series, sync_genres` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get final counts
    const { count: movieCount } = await supabase.from("movies").select("*", { count: "exact", head: true });
    const { count: seriesCount } = await supabase.from("series").select("*", { count: "exact", head: true });
    const { count: actorCount } = await supabase.from("actors").select("*", { count: "exact", head: true });
    const { count: directorCount } = await supabase.from("directors").select("*", { count: "exact", head: true });
    const { count: clipCount } = await supabase.from("explore_clips").select("*", { count: "exact", head: true });

    result.totals = {
      movies: movieCount,
      series: seriesCount,
      actors: actorCount,
      directors: directorCount,
      exploreClips: clipCount,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
