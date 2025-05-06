import { useState } from 'react';
import { Link } from 'wouter';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <i className="ri-leaf-line text-white"></i>
          </div>
          <span className="text-xl font-bold font-poppins text-primary">QuikNepal</span>
        </Link>
        
        <button 
          aria-label="Toggle Menu" 
          className="md:hidden text-neutral p-2"
          onClick={toggleMobileMenu}
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="font-medium text-primary hover:text-primary-dark transition-colors">Home</Link>
          <Link href="/calendar" className="font-medium text-neutral hover:text-primary transition-colors">Calendar</Link>
          <Link href="/date-converter" className="font-medium text-neutral hover:text-primary transition-colors">Converter</Link>
          <Link href="/vegetables" className="font-medium text-neutral hover:text-primary transition-colors">Vegetables</Link>
          <Link href="/metals" className="font-medium text-neutral hover:text-primary transition-colors">Metals</Link>
          <Link href="/rashifal" className="font-medium text-neutral hover:text-primary transition-colors">Rashifal</Link>
          <Link href="/forex" className="font-medium text-neutral hover:text-primary transition-colors">Forex</Link>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden w-full bg-white border-t border-gray-100`}>
        <div className="container mx-auto px-4 py-3">
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="font-medium text-primary py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/calendar" className="font-medium text-neutral py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Calendar</Link>
            <Link href="/date-converter" className="font-medium text-neutral py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Converter</Link>
            <Link href="/vegetables" className="font-medium text-neutral py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Vegetables</Link>
            <Link href="/metals" className="font-medium text-neutral py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Metals</Link>
            <Link href="/rashifal" className="font-medium text-neutral py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Rashifal</Link>
            <Link href="/forex" className="font-medium text-neutral py-2" onClick={() => setMobileMenuOpen(false)}>Forex</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
