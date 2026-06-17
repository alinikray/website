import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import SearchPage from './pages/SearchPage';
import MovieDetailPage from './pages/MovieDetailPage';
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import AdminDashboard from './pages/AdminDashboard';
import SettingsPage from './pages/SettingsPage';
import SupportPage from './pages/SupportPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CareersPage from './pages/CareersPage';
import AdvertisePage from './pages/AdvertisePage';
import RequestPage from './pages/RequestPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/series/:id" element={<MovieDetailPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/advertise" element={<AdvertisePage />} />
          <Route path="/request" element={<RequestPage />} />
          <Route path="/profile" element={<SettingsPage />} />
        </Route>
        <Route path="/explore" element={<ExplorePage />} />
      </Routes>
    </BrowserRouter>
  );
}
