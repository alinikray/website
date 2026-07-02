import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Play, Bookmark, User } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const noFooterRoutes = ['/explore', '/auth', '/onboarding'];
const noHeaderRoutes = ['/auth', '/onboarding'];

const bottomNavItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/explore', label: 'Discover', icon: Compass },
  { path: '/watch', label: 'Clips', icon: Play },
  { path: '/watchlist', label: 'My List', icon: Bookmark },
  { path: '/profile', label: 'Profile', icon: User },
];

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const showHeader = !noHeaderRoutes.some(r => location.pathname === r);
  const showFooter = !noFooterRoutes.some(r => location.pathname.startsWith(r));

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col relative overflow-x-hidden">
      {/* Global ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-accent-900/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-accent-800/8 blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-blue-900/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
      </div>

      {showHeader && <Header />}
      <main className="flex-1 relative z-10">{children}</main>
      {showFooter && <Footer />}

      {/* ── Mobile bottom navigation bar ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-dark-900/95 backdrop-blur-xl border-t border-white/8 safe-area-pb">
        <div className="flex items-center justify-around px-1 py-2">
          {bottomNavItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 min-w-[52px]"
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    active ? 'text-[#7C3AED]' : 'text-gray-500'
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 ${
                    active ? 'text-[#7C3AED]' : 'text-gray-600'
                  }`}
                >
                  {label}
                </span>
                {active && (
                  <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#7C3AED]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

