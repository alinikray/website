import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import DiscoveryBar from './DiscoveryBar';

export default function Layout() {
  const location = useLocation();
  const hideHeaderRoutes = ['/explore'];
  const showHeader = !hideHeaderRoutes.some(route => location.pathname.startsWith(route));
  const showDiscovery = showHeader && location.pathname === '/';

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-accent-900/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-accent-800/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-950/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {showHeader && <Header />}
        {showDiscovery && <DiscoveryBar />}
        <main className="flex-1">
          <Outlet />
        </main>
        {showHeader && <Footer />}
      </div>
    </div>
  );
}
