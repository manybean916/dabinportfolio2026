import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, LogIn, Github, Chrome } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { toast } from 'sonner';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ko' | 'en';
}

export const LoginModal = ({ isOpen, onClose, lang }: LoginModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success(lang === 'ko' ? '회원가입 성공!' : 'Sign up successful!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success(lang === 'ko' ? '로그인 성공!' : 'Login successful!');
      }
      onClose();
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        console.error('❌ Unauthorized domain:', currentDomain);
        toast.error(
          lang === 'ko'
            ? `Firebase 승인 필요: ${currentDomain}을 Firebase 콘솔의 승인된 도메인에 추가해주세요.`
            : `Firebase authorization required: Add ${currentDomain} to Firebase Console authorized domains.`,
          { duration: 10000 }
        );
        alert(
          `🔧 Firebase 설정이 필요합니다 / Firebase Setup Required\n\n` +
          `현재 도메인 / Current domain:\n${currentDomain}\n\n` +
          `다음 단계를 따라주세요 / Follow these steps:\n\n` +
          `1. Firebase Console 접속:\n   https://console.firebase.google.com/project/bean-59d45/authentication/settings\n\n` +
          `2. "Authorized domains" 섹션에서 "Add domain" 클릭\n\n` +
          `3. 위 도메인을 추가: ${currentDomain}\n\n` +
          `4. 저장 후 다시 로그인 시도`
        );
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success(lang === 'ko' ? '구글 로그인 성공!' : 'Google login successful!');
      onClose();
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        console.error('❌ Unauthorized domain:', currentDomain);
        toast.error(
          lang === 'ko'
            ? `Firebase 승인 필요: ${currentDomain}을 Firebase 콘솔의 승인된 도메인에 추가해주세요.`
            : `Firebase authorization required: Add ${currentDomain} to Firebase Console authorized domains.`,
          { duration: 10000 }
        );
        alert(
          `🔧 Firebase 설정이 필요합니다 / Firebase Setup Required\n\n` +
          `현재 도메인 / Current domain:\n${currentDomain}\n\n` +
          `다음 단계를 따라주세요 / Follow these steps:\n\n` +
          `1. Firebase Console 접속:\n   https://console.firebase.google.com/project/bean-59d45/authentication/settings\n\n` +
          `2. "Authorized domains" 섹션에서 "Add domain" 클릭\n\n` +
          `3. 위 도메인을 추가: ${currentDomain}\n\n` +
          `4. 저장 후 다시 로그인 시도`
        );
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X size={20} className="text-gray-400" />
            </button>

            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {isSignUp 
                    ? (lang === 'ko' ? '계정 생성하기' : 'Create Account') 
                    : (lang === 'ko' ? '환영합니다' : 'Welcome Back')}
                </h2>
                <p className="text-gray-500 text-sm">
                  {isSignUp 
                    ? (lang === 'ko' ? '다빈의 포트폴리오 프로젝트를 시작하세요' : 'Start your journey with Dabin\'s portfolio')
                    : (lang === 'ko' ? '로그인하여 포트폴리오를 관리하세요' : 'Login to manage your portfolio')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder={lang === 'ko' ? '이메일 주소' : 'Email Address'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-stone-200 outline-none transition-all text-sm"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder={lang === 'ko' ? '비밀번호' : 'Password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-stone-200 outline-none transition-all text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn size={18} />
                      {isSignUp ? (lang === 'ko' ? '가입하기' : 'Sign Up') : (lang === 'ko' ? '로그인' : 'Sign In')}
                    </>
                  )}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs font-semibold uppercase">
                  <span className="bg-white px-4 text-gray-400">{lang === 'ko' ? '또는' : 'Or continue with'}</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 mb-6 shadow-sm"
              >
                <Chrome size={20} className="text-gray-900" />
                <span>Google 계정으로 계속하기</span>
              </button>

              <p className="text-center text-sm text-gray-500">
                {isSignUp 
                  ? (lang === 'ko' ? '이미 계정이 있으신가요?' : 'Already have an account?')
                  : (lang === 'ko' ? '계정이 없으신가요?' : 'Don\'t have an account?')}
                {' '}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-gray-900 font-bold hover:underline"
                >
                  {isSignUp ? (lang === 'ko' ? '로그인' : 'Sign In') : (lang === 'ko' ? '가입하기' : 'Sign Up')}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
