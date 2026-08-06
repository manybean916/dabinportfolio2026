import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { LogOut, UserCircle } from 'lucide-react';

interface NavbarProps {
  lang: 'ko' | 'en';
  onToggleLang: () => void;
  onLoginClick: () => void;
}

export const Navbar = ({ lang, onToggleLang, onLoginClick }: NavbarProps) => {
  const { user, logout, isAdmin } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setTimeout(async () => {
      await logout();
      window.location.reload();
    }, 500);
  };

  // 내비게이션·버튼 등 UI 크롬은 언어와 무관하게 영문으로 통일한다
  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Work', href: '#work' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            key="logout-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed inset-0 z-[999] bg-[#E7E6E4] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#E7E6E4]/90 backdrop-blur-md border-b border-[#1A1512]/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between gap-6">
          <a
            href="#home"
            className="text-lg md:text-xl italic tracking-[0.06em] text-[#810000] shrink-0"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            YOONDABIN
          </a>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#1A1512]/70 hover:text-[#80605C] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onToggleLang}
              className="text-xs font-bold tracking-wider text-[#1A1512]/60 hover:text-[#1A1512] transition-colors"
            >
              <span className={lang === 'ko' ? 'text-[#810000]' : ''}>KR</span>
              <span className="mx-1.5 opacity-30">/</span>
              <span className={lang === 'en' ? 'text-[#810000]' : ''}>EN</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1A1512]/15">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="size-5 rounded-full" />
                  ) : (
                    <UserCircle size={16} className="text-[#1A1512]/40" />
                  )}
                  <span className="text-xs font-medium text-[#1A1512]/70 hidden lg:block max-w-[100px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 bg-[#810000] text-[#E7E6E4] text-[10px] rounded font-bold uppercase tracking-wider">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#1A1512]/40 hover:text-[#80605C] transition-colors"
                  title={lang === 'ko' ? '로그아웃' : 'Logout'}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-5 py-2 rounded-full border border-[#1A1512]/25 text-xs font-bold text-[#1A1512] hover:bg-[#1A1512] hover:text-[#E7E6E4] hover:border-[#1A1512] transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};
