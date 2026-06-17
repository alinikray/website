import HeroBanner from '../components/HeroBanner';
import ContentRow from '../components/ContentRow';
import GenreSection from '../components/GenreSection';
import ContinueWatching from '../components/ContinueWatching';
import TrendingClipsRow from '../components/TrendingClipsRow';
import DiscoverSection from '../components/DiscoverSection';
import RecommendedRow from '../components/RecommendedRow';
import MostDiscussed from '../components/MostDiscussed';
import {
  getFeaturedBanner,
  getTrendingMovies,
  getPopularSeries,
  movies,
  series,
  genres,
} from '../data/mockData';

export default function HomePage() {
  return (
    <div className="pb-16">
      {/* 1. Hero Banner */}
      <HeroBanner content={getFeaturedBanner()} />

      <div className="mt-8 md:mt-12 space-y-10 md:space-y-16">
        {/* 2. Trending Clips — discovery-first */}
        <TrendingClipsRow />

        {/* 3. Continue Watching */}
        <ContinueWatching />

        {/* 4. Most Discussed */}
        <MostDiscussed />

        {/* 4. Popular Movies */}
        <ContentRow
          title="Popular Movies"
          titlePersian="فیلم‌های محبوب"
          items={getTrendingMovies()}
          type="movie"
        />

        {/* 5. Popular Series */}
        <ContentRow
          title="Popular Series"
          titlePersian="سریال‌های محبوب"
          items={getPopularSeries()}
          type="series"
        />

        {/* 6. Genres */}
        <GenreSection genres={genres} />

        {/* 7. Discover Your Next Favorite */}
        <DiscoverSection />

        {/* 8. Recommended For You */}
        <RecommendedRow />

        {/* All Movies */}
        <ContentRow
          title="All Movies"
          titlePersian="همه فیلم‌ها"
          items={movies}
          type="movie"
        />

        {/* All Series */}
        <ContentRow
          title="All Series"
          titlePersian="همه سریال‌ها"
          items={series}
          type="series"
        />
      </div>
    </div>
  );
}
