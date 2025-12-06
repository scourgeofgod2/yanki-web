'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Menu, X, ChevronDown } from 'lucide-react';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = '' }: NavbarProps) {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navigation = [
    {
      name: 'Ürünler',
      href: '#',
      hasDropdown: true,
      dropdown: [
        { name: 'Seslendirme', href: '/products/tts', description: 'Metni ses dosyasına çevirin', icon: '🎤' },
        { name: 'Ses Klonlama', href: '/products/voice-cloning', description: 'Sesinizi klonlayın ve kullanın', icon: '👥' },
        { name: 'Deşifre', href: '/products/transcribe', description: 'Ses dosyalarını metne çevirin', icon: '📝' }
      ]
    },
    { name: 'Fiyatlar', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'Hakkımızda', href: '/about' },
    { name: 'İletişim', href: '/contact' }
  ];

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setProductsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setProductsDropdownOpen(false);
    }, 150); // 150ms delay before closing
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className={`bg-white/95 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-24">
          {/* Logo - Bigger and more modern */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-200 shadow-lg shadow-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M12 2v20"/>
                <path d="M4.93 10.93a10 10 0 0 1 14.14 0"/>
              </svg>
            </div>
            <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent font-['Inter']">Yankı</span>
          </Link>

          {/* Desktop Navigation - Bigger and modern */}
          <div className="hidden lg:flex items-center gap-10">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 font-semibold text-base transition-all duration-200 font-['Inter'] py-2 px-1 rounded-lg hover:bg-indigo-50/50">
                      {item.name}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productsDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Invisible bridge to prevent dropdown from closing */}
                    <div className="absolute top-full left-0 w-full h-2 bg-transparent"></div>
                    
                    {productsDropdownOpen && (
                      <div
                        className="absolute top-full left-0 mt-2 w-96 bg-white/98 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-200/60 p-6 z-50 transform transition-all duration-200 origin-top"
                        onMouseEnter={handleDropdownEnter}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <div className="space-y-4">
                          {item.dropdown?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-200 group border border-transparent hover:border-indigo-200"
                              onClick={() => setProductsDropdownOpen(false)}
                            >
                              <div className="text-2xl flex-shrink-0">{dropdownItem.icon}</div>
                              <div>
                                <div className="font-bold text-slate-900 group-hover:text-indigo-600 mb-1 font-['Inter'] text-lg">
                                  {dropdownItem.name}
                                </div>
                                <div className="text-sm text-slate-600 font-['Inter'] leading-relaxed">
                                  {dropdownItem.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-200">
                          <p className="text-xs text-slate-500 font-['Inter'] text-center">
                            Tüm ürünlerimizi keşfedin
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-slate-700 hover:text-indigo-600 font-semibold text-base transition-all duration-200 font-['Inter'] py-2 px-3 rounded-lg hover:bg-indigo-50/50"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons - Desktop - Bigger and modern */}
          <div className="hidden lg:flex items-center gap-4">
            {status === 'loading' ? (
              <>
                <div className="w-24 h-10 bg-slate-200 animate-pulse rounded-lg"></div>
                <div className="w-20 h-10 bg-slate-200 animate-pulse rounded-lg"></div>
              </>
            ) : session ? (
              <>
                <Link href="/dashboard" className="text-base font-semibold text-slate-700 hover:text-indigo-600 transition-all duration-200 font-['Inter'] py-2 px-4 rounded-lg hover:bg-indigo-50/50">
                  Panel
                </Link>
                <Link href="/api/auth/signout" className="bg-gradient-to-r from-slate-900 to-slate-800 text-white text-base font-semibold px-6 py-3 rounded-xl hover:from-slate-800 hover:to-slate-700 transition-all duration-200 font-['Inter'] shadow-lg shadow-slate-300 hover:shadow-xl hover:scale-105">
                  Çıkış
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-base font-semibold text-slate-700 hover:text-indigo-600 transition-all duration-200 font-['Inter'] py-2 px-4 rounded-lg hover:bg-indigo-50/50">
                  Giriş Yap
                </Link>
                <Link href="/register" className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-base font-semibold px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 font-['Inter'] shadow-lg shadow-indigo-300 hover:shadow-xl hover:scale-105">
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Bigger */}
          <button
            className="lg:hidden p-3 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu - Enhanced */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 pt-6 pb-8 bg-white/98 backdrop-blur-md">
            <div className="space-y-6">
              {/* Products Dropdown - Mobile */}
              <div>
                <button
                  onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                  className="flex items-center justify-between w-full text-slate-700 hover:text-indigo-600 font-semibold text-lg transition-all duration-200 font-['Inter'] p-3 rounded-xl hover:bg-indigo-50/50"
                >
                  Ürünler
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${productsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {productsDropdownOpen && (
                  <div className="mt-4 ml-6 space-y-4">
                    {navigation[0].dropdown?.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 py-3 text-base text-slate-600 hover:text-indigo-600 font-['Inter'] transition-all duration-200 hover:bg-indigo-50/50 rounded-lg px-3"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="text-xl">{item.icon}</span>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Other Nav Items - Mobile */}
              {navigation.slice(1).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-slate-700 hover:text-indigo-600 font-semibold text-lg transition-all duration-200 font-['Inter'] p-3 rounded-xl hover:bg-indigo-50/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Auth Buttons - Mobile */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                {status === 'loading' ? (
                  <>
                    <div className="w-full h-12 bg-slate-200 animate-pulse rounded-xl"></div>
                    <div className="w-full h-12 bg-slate-200 animate-pulse rounded-xl"></div>
                  </>
                ) : session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block w-full text-center py-4 text-slate-700 hover:text-indigo-600 font-semibold text-lg transition-all duration-200 font-['Inter'] rounded-xl hover:bg-indigo-50/50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Panel
                    </Link>
                    <Link
                      href="/api/auth/signout"
                      className="block w-full text-center py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold text-lg rounded-xl hover:from-slate-800 hover:to-slate-700 transition-all duration-200 font-['Inter'] shadow-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Çıkış
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block w-full text-center py-4 text-slate-700 hover:text-indigo-600 font-semibold text-lg transition-all duration-200 font-['Inter'] rounded-xl hover:bg-indigo-50/50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full text-center py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-lg rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 font-['Inter'] shadow-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Kayıt Ol
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
