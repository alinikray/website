import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

const footerLinks = {
  product: [
    { to: '/movies', label: 'Movies' },
    { to: '/series', label: 'TV Series' },
    { to: '/search', label: 'Search' },
    { to: '/explore', label: 'Explore' },
  ],
  company: [
    { to: '/about', label: 'About Us' },
    { to: '/careers', label: 'Careers' },
    { to: '/contact', label: 'Contact' },
    { to: '/advertise', label: 'Advertise' },
  ],
  support: [
    { to: '/faq', label: 'FAQ' },
    { to: '/support', label: 'Help Center' },
    { to: '/request', label: 'Request Content' },
    { to: '/terms', label: 'Terms of Service' },
  ],
  legal: [
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Use' },
    { to: '/dmca', label: 'DMCA' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-surface-800/50 bg-surface-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-surface-300 bg-clip-text text-transparent">
                Fynex Movies
              </span>
            </Link>
            <p className="mt-4 text-sm text-surface-500 max-w-xs">
              Your ultimate destination for streaming movies and TV series. Discover, watch, and enjoy.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-surface-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-surface-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-surface-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-surface-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500">
            {new Date().getFullYear()} Fynex Movies. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-surface-500">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
