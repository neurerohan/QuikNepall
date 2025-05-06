import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <i className="ri-leaf-line text-primary"></i>
              </div>
              <span className="text-xl font-bold font-poppins">QuikNepal</span>
            </div>
            <p className="text-white/80 text-sm">Your comprehensive resource for essential Nepali information, providing accurate data for everyday needs.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-white/80 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/calendar" className="text-white/80 hover:text-white transition-colors">Calendar</Link></li>
              <li><Link href="/date-converter" className="text-white/80 hover:text-white transition-colors">Date Converter</Link></li>
              <li><Link href="/vegetables" className="text-white/80 hover:text-white transition-colors">Vegetable Rates</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/metals" className="text-white/80 hover:text-white transition-colors">Metal Prices</Link></li>
              <li><Link href="/rashifal" className="text-white/80 hover:text-white transition-colors">Rashifal</Link></li>
              <li><Link href="/forex" className="text-white/80 hover:text-white transition-colors">Forex Rates</Link></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">API Access</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <i className="ri-facebook-fill text-lg"></i>
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <i className="ri-twitter-fill text-lg"></i>
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <i className="ri-instagram-fill text-lg"></i>
              </a>
            </div>
            <p className="text-white/80 text-sm">Contact us at: info@quiknepal.com</p>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/80 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} QuikNepal. All rights reserved.</p>
          <p className="text-white/80 text-sm">Powered by QuikNepal</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
