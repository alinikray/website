import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const noFooterRoutes = ['/explore', '/auth', '/onboarding'];
const noHeaderRoutes = ['/auth', '/onboarding'];

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const showHeader = !noHeaderRoutes.some(r => location.pathname === r);
  const showFooter = !noFooterRoutes.some(r => location.pathname.startsWith(r));

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {showHeader && <Header />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
