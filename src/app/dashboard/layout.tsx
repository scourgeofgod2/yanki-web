"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
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
  User,
  BarChart2,
  MessageSquare,
  History // ✅ Eklendi: Eksik olan import
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
  const pathname = usePathname();

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
      case 'starter': return { credits: 50000, name: 'Başlangıç' };
      case 'popular': return { credits: 200000, name: 'Popüler' };
      case 'enterprise': return { credits: 500000, name: 'Kurumsal' };
      default: return { credits: 500, name: 'Ücretsiz' };
    }
  };

  const planLimits = getPlanLimits(userData?.plan);
  const maxCredits = planLimits.credits;
  const currentCredits = userData?.credits ?? (session?.user as any)?.credits ?? 500;
  const usagePercentage = maxCredits > 0 ? ((maxCredits - currentCredits) / maxCredits) * 100 : 0;

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  useEffect(() => {
    const handleCloseMobileMenu = () => setMobileMenuOpen(false);
    window.addEventListener('closeMobileMenu', handleCloseMobileMenu);
    return () => window.removeEventListener('closeMobileMenu', handleCloseMobileMenu);
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-pulse text-lg text-white/50">Yükleniyor...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-[#F8F9FC] font-sans text-slate-800">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-black border border-white/10 rounded-lg shadow-sm text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ---------------- DARK SIDEBAR ---------------- */}
      <aside className={`w-72 bg-[#0F0F0F] text-white flex flex-col justify-between h-screen overflow-y-auto transition-transform duration-300 z-40 border-r border-white/5 ${
        mobileMenuOpen
          ? 'fixed left-0 top-0 translate-x-0'
          : 'fixed left-0 top-0 -translate-x-full md:translate-x-0 md:sticky'
      }`}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 pl-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
               <div className="flex gap-0.5 items-end h-4">
                  <div className="w-1 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="w-1 h-4 bg-white rounded-full animate-pulse delay-75"></div>
                  <div className="w-1 h-3 bg-white rounded-full animate-pulse delay-150"></div>
               </div>
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Yankı.ai</span>
          </div>

          {/* Navigation */}
          <div className="space-y-8">
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">Platform</p>
              <div className="space-y-1">
                <NavItem icon={<LayoutDashboard />} label="Panel" href="/dashboard" active={pathname === '/dashboard'} />
                <NavItem icon={<Mic />} label="Stüdyo" href="/dashboard/studio" active={pathname === '/dashboard/studio'} />
                <NavItem icon={<Compass />} label="Sesler" href="/dashboard/voices" active={pathname === '/dashboard/voices'} />
                <NavItem icon={<Wand2 />} label="Klonlama" href="/dashboard/cloning" active={pathname === '/dashboard/cloning'} />
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">Araçlar</p>
              <div className="space-y-1">
                <NavItem icon={<FileText />} label="Deşifre" href="/dashboard/transcribe" active={pathname === '/dashboard/transcribe'} />
                <NavItem icon={<History />} label="Geçmiş" href="/dashboard/history" active={pathname === '/dashboard/history'} />
                <NavItem icon={<BarChart2 />} label="Raporlar" href="/dashboard/reports" />
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">Ayarlar</p>
              <div className="space-y-1">
                <NavItem icon={<User />} label="Hesap" href="/dashboard/profile" active={pathname === '/dashboard/profile'} />
                <NavItem icon={<Settings />} label="Ayarlar" href="/dashboard/settings" />
                <NavItem icon={<HelpCircle />} label="Destek" href="/dashboard/support" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sidebar - User Profile */}
        <div className="p-4 m-4 bg-white/5 rounded-2xl border border-white/5">
           <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                {userData?.name?.charAt(0) || session.user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {userData?.name || session.user?.name || 'Kullanıcı'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {currentCredits.toLocaleString()} kredi
                </p>
              </div>
           </div>
           
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
           >
             <LogOut className="w-3.5 h-3.5" />
             Çıkış Yap
           </button>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        {/* Top Header Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#F0F2F5] to-transparent -z-10"></div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 pb-32 pt-20 md:pt-12">
          {children}
        </div>
      </main>
    </div>
  );
}

// Helper Component for Nav Items
function NavItem({ icon, label, active = false, href = '#', disabled = false }: {
  icon: React.ReactNode,
  label: string,
  active?: boolean,
  href?: string,
  disabled?: boolean
}) {
  const baseClasses = "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative";
  const activeClasses = active 
    ? "bg-white text-black shadow-lg shadow-white/5" 
    : "text-gray-400 hover:text-white hover:bg-white/5";

  if (disabled) {
    return (
      <div className={`${baseClasses} text-gray-600 cursor-not-allowed`}>
        <span className="w-5 h-5 opacity-50">{icon}</span>
        {label}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseClasses} ${activeClasses}`}
      onClick={() => {
        if (window.innerWidth < 768) {
          const event = new CustomEvent('closeMobileMenu');
          window.dispatchEvent(event);
        }
      }}
    >
      {/* Active Indicator Line */}
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-full"></div>}
      
      <span className={`w-5 h-5 ${active ? 'text-indigo-600' : 'group-hover:text-white'}`}>{icon}</span>
      {label}
    </Link>
  );
}