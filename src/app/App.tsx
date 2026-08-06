import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { ProjectsProvider } from './context/ProjectsContext';
import { Home } from './pages/Home';
import { ProjectDetail } from './pages/ProjectDetail';

// 라우트가 바뀌면 항상 페이지 최상단에서 시작한다
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppRoutes = () => {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const toggleLang = () => setLang(prev => (prev === 'ko' ? 'en' : 'ko'));

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home lang={lang} onToggleLang={toggleLang} />} />
        <Route path="/project/:id" element={<ProjectDetail lang={lang} onToggleLang={toggleLang} />} />
      </Routes>
      <Toaster position="bottom-right" expand={false} richColors />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ProjectsProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ProjectsProvider>
    </AuthProvider>
  );
};

export default App;
