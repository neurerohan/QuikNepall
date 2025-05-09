import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-md backdrop-blur-lg bg-white/95' : 'bg-gradient-to-r from-[#57c84d] to-[#83d475]'
    }`}>
      {/* Top gradient border */}
      <div className="h-1 bg-gradient-to-r from-[#57c84d] via-[#65cc56] to-[#83d475] bg-[length:200%_100%] animate-gradient"></div>
      
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
            isScrolled ? 'bg-gradient-to-r from-[#57c84d] to-[#83d475] shadow-sm' : 'bg-white/20 backdrop-blur-sm'
          }`}>
            <i className={`ri-leaf-line text-lg ${isScrolled ? 'text-white' : 'text-white'}`}></i>
          </div>
          <span className={`text-xl font-bold font-poppins transition-colors duration-300 group-hover:translate-x-0.5 transform ${
            isScrolled ? 'text-primary' : 'text-white'
          }`}>QuikNepal</span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          aria-label="Toggle Menu" 
          className={`md:hidden p-2.5 rounded-lg transition-colors duration-300 ${
            isScrolled ? 'text-neutral hover:bg-gray-100' : 'text-white hover:bg-white/10'
          }`}
          onClick={toggleMobileMenu}
        >
          <i className={`${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl`}></i>
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {[
            { path: '/', label: 'Home' },
            { path: '/calendar', label: 'Calendar' },
            { path: '/date-converter', label: 'Converter' },
            { path: '/vegetables', label: 'Vegetables' },
            { path: '/metals', label: 'Metals' },
            { path: '/rashifal', label: 'Rashifal' },
            { path: '/forex', label: 'Forex' }
          ].map((item) => (
            <Link 
              key={item.path}
              href={item.path} 
              className={`font-medium px-4 py-2 rounded-lg transition-all duration-300 mx-0.5 ${
                isActive(item.path)
                  ? isScrolled 
                    ? 'bg-primary-light/10 text-primary font-semibold' 
                    : 'bg-white/20 text-white font-semibold backdrop-blur-sm'
                  : isScrolled
                    ? 'text-neutral hover:bg-gray-50 hover:text-primary' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Mobile Menu - Enhanced */}
      <div 
        className={`${mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'} 
          md:hidden w-full overflow-hidden transition-all duration-300 ease-in-out ${
            isScrolled ? 'bg-white border-t border-gray-100' : 'bg-gradient-to-r from-[#57c84d] to-[#83d475]'
          }`}
      >
        <div className="container mx-auto px-4 py-3">
          <nav className="flex flex-col space-y-2 py-2">
            {[
              { path: '/', label: 'Home' },
              { path: '/calendar', label: 'Calendar' },
              { path: '/date-converter', label: 'Converter' },
              { path: '/vegetables', label: 'Vegetables' },
              { path: '/metals', label: 'Metals' },
              { path: '/rashifal', label: 'Rashifal' },
              { path: '/forex', label: 'Forex' }
            ].map((item) => (
              <Link 
                key={item.path}
                href={item.path} 
                className={`font-medium py-2.5 px-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? isScrolled 
                      ? 'bg-primary-light/10 text-primary font-semibold' 
                      : 'bg-white/20 text-white font-semibold'
                    : isScrolled
                      ? 'text-neutral hover:bg-gray-50 hover:text-primary' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
