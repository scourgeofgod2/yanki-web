"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  LayoutDashboard,
  Compass,
  Mic,
  Music,
  Settings,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Zap,
  Film,
  Headphones,
  Wand2,
  LogOut,
  Menu,
  X,
  FileText,
  User
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  credits: number;
  plan: string;
  totalGenerations: number;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  // Kullanıcı verilerini al
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      }
    } catch (error) {
      console.error('Kullanıcı verileri alınamadı:', error);
    }
  };

  // Plan bazında kredi limitleri
  const getPlanLimits = (plan?: string) => {
    switch(plan) {
      case 'starter':
        return { credits: 50000, name: 'Başlangıç' };
      case 'popular':
        return { credits: 200000, name: 'Popüler' };
      case 'enterprise':
        return { credits: 500000, name: 'Kurumsal' };
      default:
        return { credits: 500, name: 'Ücretsiz' };
    }
  };

  // Kredi hesaplamaları
  const planLimits = getPlanLimits(userData?.plan);
  const maxCredits = planLimits.credits;
  const currentCredits = userData?.credits ?? (session?.user as any)?.credits ?? 500;
  const usagePercentage = maxCredits > 0 ? ((maxCredits - currentCredits) / maxCredits) * 100 : 0;

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Mobil menü kapama event listener'ı
  useEffect(() => {
    const handleCloseMobileMenu = () => {
      setMobileMenuOpen(false);
    };

    window.addEventListener('closeMobileMenu', handleCloseMobileMenu);
    return () => {
      window.removeEventListener('closeMobileMenu', handleCloseMobileMenu);
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-pulse text-lg text-slate-600">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-slate-800 font-sans">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ---------------- SIDEBAR ---------------- */}
      <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-screen overflow-y-auto transition-all duration-300 z-40 ${
        mobileMenuOpen
          ? 'fixed left-0 top-0 md:sticky md:top-0'
          : 'fixed -left-64 top-0 md:sticky md:top-0 md:left-0'
      }`}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <div className="w-4 h-2 border-b-2 border-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tight">Yankı</span>
          </div>

          {/* Workspace Dropdown */}
          <div className="mb-6">
            <button className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded sm:rounded-sm"></div>
                Ana Çalışma Alanı
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Arama yapın..."
              className="w-full pl-9 pr-4 py-2 bg-transparent border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500"
            />
            <span className="absolute right-3 top-2.5 text-xs text-gray-400 border border-gray-200 rounded px-1">
              ⌘ F
            </span>
          </div>

          {/* Main Menu */}
          <div className="space-y-1 mb-8">
            <p className="text-xs font-semibold text-gray-400 mb-2 px-3">ANA MENÜ</p>
            <NavItem icon={<LayoutDashboard />} label="Panel" href="/dashboard" active />
            <NavItem icon={<Compass />} label="Ses Kütüphanesi" href="/dashboard/voices" />
            <NavItem icon={<Mic />} label="Stüdyo" href="/dashboard/studio" />
            <NavItem icon={<Wand2 />} label="Ses Klonlama" href="/dashboard/cloning" />
            <NavItem icon={<Sparkles />} label="Geçmiş Sesler" href="/dashboard/history" />
          </div>

          {/* Advanced Menu */}
          <div className="space-y-1 mb-8">
            <p className="text-xs font-semibold text-gray-400 mb-2 px-3">GELİŞMİŞ</p>
            <NavItem icon={<FileText />} label="Deşifre" href="/dashboard/transcribe" />
          </div>

           {/* Others Menu */}
           <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 mb-2 px-3">HESAP</p>
            <NavItem icon={<User />} label="Profil Bilgileri" href="/dashboard/profile" />
            <NavItem icon={<HelpCircle />} label="Yardım ve Destek" />
          </div>
        </div>

        {/* Bottom Sidebar */}
        <div className="p-4 border-t border-gray-100">
          {/* Credits Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
             <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold">
                  {currentCredits} / {maxCredits}
                </span>
                <span className="text-xs text-gray-500">
                  {userData?.plan || session.user?.plan || 'Ücretsiz'}
                </span>
           </div>
           <p className="text-xs text-gray-500 mb-3">
             {planLimits.name} plan - {maxCredits >= 50000 ? `${(maxCredits/1000).toLocaleString('tr-TR')}K kredi/ay` : `günlük ${maxCredits} karakter`}
           </p>
           <div className="w-full bg-gray-100 h-2 rounded-full mb-3 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${usagePercentage}%` }}
              ></div>
           </div>
             <button className="w-full py-1.5 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50">
                Yükselt
             </button>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 px-1 hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
              {userData?.name?.charAt(0) || session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">
                  {userData?.name || session.user?.name || 'Kullanıcı'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user?.email || 'user@example.com'}
                </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Çıkış Yap"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 pt-16 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}

// ---------------- HELPER COMPONENTS ----------------

function NavItem({ icon, label, active = false, href = '#', disabled = false }: {
  icon: React.ReactNode,
  label: string,
  active?: boolean,
  href?: string,
  disabled?: boolean
}) {
    if (disabled) {
        return (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 cursor-not-allowed">
                <span className="w-4 h-4">{icon}</span>
                {label}
            </div>
        )
    }

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            onClick={() => {
                // Mobil menüyü kapat (eğer parent component'te setMobileMenuOpen varsa)
                if (window.innerWidth < 768) {
                    const event = new CustomEvent('closeMobileMenu');
                    window.dispatchEvent(event);
                }
            }}
        >
            <span className="w-4 h-4">{icon}</span>
            {label}
        </Link>
    )
}
