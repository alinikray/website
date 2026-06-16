import { useRef } from 'react';
import HeroBanner from '../components/HeroBanner';
import ContentRow from '../components/ContentRow';
import FeaturedSection from '../components/FeaturedSection';
import GenreSection from '../components/GenreSection';
import ContinueWatching from '../components/ContinueWatching';
import ExplorePreview from '../components/ExplorePreview';
import {
  getFeaturedBanner,
  getTrendingMovies,
  getNewReleases,
  getPopularSeries,
  getTopRated,
  movies,
  series,
  genres,
} from '../data/mockData';

export default function HomePage() {
  const trendingRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-8 md:space-y-12 pb-12">
      {/* Hero Banner */}
      <HeroBanner content={getFeaturedBanner()} />

      {/* Content Sections */}
      <div className="space-y-10 md:space-y-14">
        {/* Trending Movies */}
        <ContentRow
          title="Trending Movies"
          titlePersian="فیلم‌های پرطرفدار"
          items={getTrendingMovies()}
          type="movie"
          ref={trendingRef}
        />

        {/* Popular Series */}
        <ContentRow
          title="Popular Series"
          titlePersian="سریال‌های محبوب"
          items={getPopularSeries()}
          type="series"
        />

        {/* Featured Section - Large Cards */}
        <FeaturedSection />

        {/* Top Rated */}
        <ContentRow
          title="Top Rated"
          titlePersian="با بالاترین امتیاز"
          items={getTopRated().slice(0, 8)}
          type="mixed"
        />

        {/* New Releases */}
        <ContentRow
          title="New Releases"
          titlePersian="تازه‌ها"
          items={getNewReleases()}
          type="movie"
          showBadge
        />

        {/* Continue Watching */}
        <ContinueWatching />

        {/* Genre Section */}
        <GenreSection genres={genres} />

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

        {/* Explore Preview */}
        <ExplorePreview />
      </div>
    </div>
  );
}
