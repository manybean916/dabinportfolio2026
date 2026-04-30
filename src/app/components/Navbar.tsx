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
  const navLinks = [
    { name: lang === 'ko' ? '홈' : 'Home', href: '#home' },
    { name: lang === 'ko' ? '소개' : 'About Me', href: '#about' },
    { name: lang === 'ko' ? '포트폴리오' : 'Portfolio', href: '#portfolio' },
    { name: lang === 'ko' ? '연락처' : 'Contact', href: '#contact' },
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
          className="fixed inset-0 z-[999] bg-white pointer-events-none"
        />
      )}
    </AnimatePresence>
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex-1 flex justify-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-tight whitespace-nowrap"
            style={{ fontFamily: 'var(--font-pretendard)' }}
          >
            Design Portfolio 2026
          </motion.div>
        </div>
        
        <div className="hidden lg:flex items-center justify-center flex-none">
          <div className="flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.a
                key={`${link.href}-${lang}`}
                href={link.href}
                initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: index * 0.05 
                }}
                className="text-sm font-medium py-2 rounded-full text-gray-600 hover:text-black hover:bg-stone-100 transition-colors w-[110px] text-center whitespace-nowrap"
                style={{ fontFamily: 'var(--font-pretendard)' }}
              >
                {link.href === '#contact' 
                  ? (lang === 'ko' ? '함께하기' : 'Get in Touch') 
                  : (link.href === '#portfolio' ? (lang === 'ko' ? '프로젝트' : 'Projects') : link.name)}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="flex-1 flex justify-end items-center gap-4">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onToggleLang}
            className="bg-stone-100 text-gray-900 px-4 py-2 rounded-full text-xs font-bold hover:bg-stone-200 transition-all active:scale-95 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-pretendard)' }}
          >
            <span className={lang === 'ko' ? 'text-black' : 'text-gray-400'}>KR</span>
            <span className="text-gray-300">|</span>
            <span className={lang === 'en' ? 'text-black' : 'text-gray-400'}>EN</span>
          </motion.button>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 rounded-full border border-stone-100">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="size-6 rounded-full" />
                ) : (
                  <UserCircle size={18} className="text-stone-400" />
                )}
                <span className="text-xs font-medium text-gray-600 hidden md:block max-w-[100px] truncate">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                {isAdmin && (
                  <span className="ml-1 px-1.5 py-0.5 bg-black text-white text-[10px] rounded font-bold uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title={lang === 'ko' ? '로그아웃' : 'Logout'}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onLoginClick}
              className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-sm"
              style={{ fontFamily: 'var(--font-pretendard)' }}
            >
              {lang === 'ko' ? '로그인' : 'Login'}
            </motion.button>
          )}
        </div>
      </div>
    </nav>
    </>
  );
};
