import React, { useState } from 'react';
import { Menu as MenuIcon, X, Home, Info } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    {
      path: 'https://movies.shittydocs.com',
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
          <line x1="7" y1="2" x2="7" y2="22"></line>
          <line x1="17" y1="2" x2="17" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <line x1="2" y1="7" x2="7" y2="7"></line>
          <line x1="2" y1="17" x2="7" y2="17"></line>
          <line x1="17" y1="17" x2="22" y2="17"></line>
          <line x1="17" y1="7" x2="22" y2="7"></line>
        </svg>
      ),
      label: 'ShittyMovies',
      external: true
    },
    { path: '/about', icon: Info, label: 'About' }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#3c1f10]/80 
                 hover:bg-[#3c1f10] transition-all duration-200
                 text-amber-200/90 hover:text-amber-200
                 border border-amber-900/20 shadow-inner"
      >
        <MenuIcon size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-[#3c1f10]/95 backdrop-blur-sm z-50 flex">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-amber-200/20 
                     hover:bg-amber-200/30 transition-colors duration-200 
                     text-amber-200/90 hover:text-amber-200"
          >
            <X size={24} />
          </button>

          <nav className="w-full max-w-md mx-auto mt-20 px-6">
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.path}>
                  {item.external ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-xl 
                             text-amber-200/70 hover:bg-amber-200/10
                             transition-all duration-200`}
                    >
                      {typeof item.icon === 'function' ? item.icon() : <item.icon size={24} />}
                      <span className="text-xl">{item.label}</span>
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-xl 
                             ${location.pathname === item.path 
                               ? 'bg-amber-200/20 text-amber-200' 
                               : 'text-amber-200/70 hover:bg-amber-200/10'} 
                             transition-all duration-200`}
                    >
                      {typeof item.icon === 'function' ? item.icon() : <item.icon size={24} />}
                      <span className="text-xl">{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}