import { Link } from 'react-router-dom';

/**
 * Footer component with links and branding.
 */
const Footer = () => {
  return (
    <footer className="bg-dark-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">📚</span>
              <span className="text-xl font-bold">Bookstore</span>
            </div>
            <p className="text-dark-400 max-w-md">
              Your one-stop destination for books across all genres. Discover, browse, and shop from our curated collection of titles.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-dark-400">
              <li><Link to="/books" className="hover:text-white transition-colors">Browse Books</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2 text-dark-400">
              <li className="hover:text-white transition-colors cursor-pointer">Fiction</li>
              <li className="hover:text-white transition-colors cursor-pointer">Science</li>
              <li className="hover:text-white transition-colors cursor-pointer">Technology</li>
              <li className="hover:text-white transition-colors cursor-pointer">History</li>
              <li className="hover:text-white transition-colors cursor-pointer">Self-Help</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-dark-700 mt-8 pt-8 text-center text-dark-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Bookstore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
