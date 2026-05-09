"use client"
import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, ChevronDown, School, Landmark } from 'lucide-react';
import { siteInfo } from '../../data/mockData';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'হোম', href: '/' },
    { label: 'আমাদের সম্পর্কে', href: '/about' },
    {
      label: 'শিক্ষার্থী',
      href: '/students',
      /*submenu: [
        { label: 'অধ্যয়নরত শিক্ষার্থীর সংখ্যা', href: '/students' }
      ]*/
    },
    // {
    //   label: 'চ্যাটবট',
    //   href: '/chat'
    // },
    { label: 'নোটিশ', href: '/notice', },
    {
      label: 'শিক্ষকবৃন্দ',
      href: '#teachers',
      submenu: [
        { label: 'স্কুল কমিটি শিক্ষকবৃন্দ', href: 'teacher' }
      ]
    },
    { label: 'গ্যালারি', href: '/gallery' },
    { label: 'যোগাযোগ', href: '/contact' },
    
  ];

  return (
  <nav className={`w-full z-50 transition-all duration-300 
  ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-2' : 'bg-white py-4'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          {/* Changed bg-primary to bg-sky-600 */}
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            <Landmark />
          </div>
          <div>
            <Link href={'/'}>
              {/* Changed text-(--primary-dark) to text-slate-900 for better contrast */}
              <h1 className="font-bold text-lg md:text-xl text-primary-700 leading-tight">
                {siteInfo.schoolName}
              </h1>
            </Link>
            <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest">Knowledge is Power</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
      {menuItems.map((item, index) => {
        // Check if current path matches the link href
        const isActive = pathname === item.href;

        return (
          <div key={index} className="relative group py-2">
            <Link
              href={item.href}
              className={`font-medium transition-colors flex items-center gap-1 cursor-pointer 
                ${isActive ? 'text-primary-600' : 'text-slate-700 hover:text-primary-600'}`}
            >
              {item.label}
              {item.submenu && (
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              )}
              
              {/* Underline Indicator for Active Menu */}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full" />
              )}
            </Link>
                        {/* Hoverable Dropdown Submenu */}
            {item.submenu && (
              <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-xl border border-slate-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                {item.submenu.map((sub) => {
                  const isSubActive = pathname === sub.href;
                  return (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      className={`block px-6 py-3 font-medium transition-colors 
                        ${isSubActive 
                          ? 'bg-primary-50 text-primary-700' 
                          : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700'}`}
                    >
                      {sub.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      
      <Link href="/login">
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full font-medium flex items-center gap-2 transition-all">
          <LogIn size={18} />
          পোর্টাল লগইন
        </button>
      </Link>
    </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-slate-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t shadow-xl p-4 flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          {menuItems.map((item) => (
            <div key={item.label} className="border-b border-slate-100 last:border-0">
              <div
                className="flex items-center justify-between py-3 px-2 text-lg font-medium text-slate-700 cursor-pointer"
                onClick={() => {
                  if (item.submenu) {
                    setActiveMobileDropdown(activeMobileDropdown === item.label ? null : item.label);
                  } else {
                    setIsOpen(false);
                  }
                }}
              >
                <div className="flex-1">
                  {item.submenu ? item.label : <a href={item.href}>{item.label}</a>}
                </div>
                {item.submenu && <ChevronDown size={20} className={`transition-transform duration-300 ${activeMobileDropdown === item.label ? 'rotate-180' : ''}`} />}
              </div>

              {item.submenu && activeMobileDropdown === item.label && (
                <div className="bg-slate-50 rounded-lg mb-2 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                  {item.submenu.map((sub) => (
                    <a
                      key={sub.label}
                      href={sub.href}
                      // Changed border and hover text to sky-600
                      className="block p-4 text-slate-600 font-medium hover:text-primary-600 border-l-4 border-primary-600"
                      onClick={() => setIsOpen(false)}
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* Changed bg-primary to bg-sky-600 */}
          <Link href={`/login`}>
            <button className="bg-primary-600 hover:bg-primary-700 text-white w-full py-3 mt-4 rounded-lg font-bold flex items-center justify-center gap-2">
              <LogIn size={20} />
              পোর্টাল লগইন
            </button>
          </Link>
          
        </div>
      )}

      
        {/* <ThemeSwitcher /> */}
      
    </nav>

  );
};

export default Navbar;
