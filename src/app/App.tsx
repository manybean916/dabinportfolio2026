import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Intro } from './components/Intro';
import { PortfolioGrid } from './components/PortfolioGrid';
import { ServicesSection } from './components/ServicesSection';
import { Footer } from './components/Footer';
import { AddProjectModal } from './components/AddProjectModal';
import { LoginModal } from './components/LoginModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster, toast } from 'sonner';
import { ref, get, push, set, remove, child } from 'firebase/database';
import { db } from '../lib/firebase';
import projectImg1 from "../imports/KakaoTalk_20260415_175036426.jpg";
import projectImg2 from "../imports/스크린샷(5).png";
import projectImg3 from "../imports/인터뷰실습.jpg";

const AppContent = () => {
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  
  const toggleLang = () => setLang(prev => prev === 'ko' ? 'en' : 'ko');
  
  const initialProjects = [
    {
      id: "project:1",
      title: "2026 UX 리서치 전략 심층 인터뷰",
      category: "UX Research",
      imageUrl: projectImg1,
      link: "https://example.com/ux-research"
    },
    {
      id: "project:2",
      title: "stakeholder분석 및 대시보드 제작",
      category: "Product Design",
      imageUrl: projectImg2,
      link: "https://service-2026-foldable-market-super-cycle-dashboar-152446546512.us-west1.run.app"
    },
    {
      id: "project:3",
      title: "페르소나설정 실습",
      category: "E-commerce",
      imageUrl: "https://ik.imagekit.io/cuquvvrdw/bwan/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7(2).png",
      link: "https://morph-thing-84845400.figma.site"
    },
    {
      id: "project:4",
      title: "Green Spaces",
      category: "Sustainable Design",
      imageUrl: "https://images.unsplash.com/photo-1766157669263-399796aa3ccd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzc2MTU1ODI0fDA"
    },
    {
      id: "project:5",
      title: "Mobile Magic",
      category: "App Development",
      imageUrl: "https://images.unsplash.com/photo-1695634281254-e94a29d234c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0Zm9saW8lMjBwcm9qZWN0JTIwbW9ja3VwJTIwMXxlbnwxfHx8fDE3NzYxNTU4MjF8MA"
    },
    {
      id: "project:6",
      title: "Brand Identity",
      category: "Graphic Design",
      imageUrl: "https://images.unsplash.com/photo-1771209599712-26b11f55ecc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYnJhbmQlMjBpZGVudGl0eSUyMGRlc2lnbnxlbnwxfHx8fDE3NzYxNTU4MjF8MA"
    },
    {
      id: "project:7",
      title: "Interactive Hub",
      category: "Web Design",
      imageUrl: "https://images.unsplash.com/photo-1765371514743-45bd8e6c0a28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBtaW5pbWFsaXN0JTIwZGVzaWduZXIlMjBvZmZpY2V8ZW58MXx8fHwxNzc2MTU1ODIxfDA"
    },
    {
      id: "project:8",
      title: "E-commerce Edge",
      category: "User Experience",
      imageUrl: "https://images.unsplash.com/photo-1764268733605-4b58c566faf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG1pbmltYWxpc3RhcnQlMjBkZXNpZ258ZW58MXx8fHwxNzc2MTU1ODIxfDA"
    },
    {
      id: "project:9",
      title: "Service Solutions",
      category: "Strategic Design",
      imageUrl: "https://images.unsplash.com/photo-1730206562928-0efd62560435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGRlc2lnbiUyMHN0dWRpbyUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzYxNTU4MjF8MA"
    }
  ];

  const [projects, setProjects] = useState<any[]>(initialProjects);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, "projects"));
      
      if (snapshot.exists()) {
        const data: any[] = [];
        snapshot.forEach((childSnapshot) => {
          data.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        
        data.sort((a, b) => {
          const timeA = a.updatedAt || 0;
          const timeB = b.updatedAt || 0;
          if (timeA !== timeB) return timeB - timeA;
          if (b.id > a.id) return 1;
          if (b.id < a.id) return -1;
          return 0;
        });
        
        setProjects(data);
      } else {
        // DB가 비어있을 경우 그냥 빈 배열로 유지 (자동 덮어쓰기 하지 않음)
        console.log("No projects found in DB.");
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects, falling back to local state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target || !target.hash || !target.hash.startsWith('#')) return;

      const href = target.getAttribute('href');
      if (href && !href.startsWith('#')) return;

      const targetId = target.hash;
      if (targetId.length > 1 && !targetId.startsWith('#!')) {
        try {
          if (/^#[a-zA-Z0-9\-_:]+$/.test(targetId)) {
            const targetElement = document.getElementById(targetId.substring(1));
            if (targetElement) {
              e.preventDefault();
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }
          }
        } catch (err) {
          console.warn('Smooth scroll navigation error:', err);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => { document.removeEventListener('click', handleAnchorClick); };
  }, []);

  const handleAddProject = async (newProject: any) => {
    if (!isAdmin) {
      toast.error(lang === 'ko' ? '권한이 없습니다.' : 'You do not have permission.');
      return;
    }
    
    try {
      const now = Date.now();
      if (editingIndex !== null) {
        const projectId = projects[editingIndex].id;
        const updatedProject = { ...newProject, updatedAt: now };
        
        if (projects[editingIndex].createdAt) {
          updatedProject.createdAt = projects[editingIndex].createdAt;
        }

        try {
          const projectRef = ref(db, `projects/${projectId}`);
          await set(projectRef, updatedProject);
        } catch (e) {
          console.warn("Database update failed, updating local state only");
        }
        
        const updated = [...projects];
        updated[editingIndex] = { id: projectId, ...updatedProject };
        
        updated.sort((a, b) => {
          const timeA = a.updatedAt || 0;
          const timeB = b.updatedAt || 0;
          if (timeA !== timeB) return timeB - timeA;
          if (b.id > a.id) return 1;
          if (b.id < a.id) return -1;
          return 0;
        });
        
        setProjects(updated);
        toast.success(lang === 'ko' ? '프로젝트가 성공적으로 수정되었습니다.' : 'Project successfully updated.');
      } else {
        let newId = `local-${now}`;
        const newProjectWithTime = { ...newProject, createdAt: now, updatedAt: now };
        try {
          const newProjectRef = push(ref(db, "projects"));
          await set(newProjectRef, newProjectWithTime);
          if (newProjectRef.key) newId = newProjectRef.key;
        } catch (e) {
          console.warn("Database add failed, using local state only");
        }
        
        const newProjectsList = [{ id: newId, ...newProjectWithTime }, ...projects];
        
        newProjectsList.sort((a, b) => {
          const timeA = a.updatedAt || 0;
          const timeB = b.updatedAt || 0;
          if (timeA !== timeB) return timeB - timeA;
          if (b.id > a.id) return 1;
          if (b.id < a.id) return -1;
          return 0;
        });
        
        setProjects(newProjectsList);
        toast.success(lang === 'ko' ? '새 프로젝트가 추가되었습니다.' : 'New project added.');
      }
      
      setEditingIndex(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error(lang === 'ko' ? '프로젝트 저장 중 오류가 발생했습니다.' : 'Error saving project.');
    }
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (index: number) => {
    if (!isAdmin) {
      toast.error(lang === 'ko' ? '권한이 없습니다.' : 'You do not have permission.');
      return;
    }
    
    const projectToDelete = projects[index];
    const confirmMsg = lang === 'ko'
      ? `"${projectToDelete.title}" 프로젝트를 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
      : `Are you sure you want to delete "${projectToDelete.title}"?\nThis cannot be undone.`;

    if (window.confirm(confirmMsg)) {
      try {
        try {
          await remove(ref(db, `projects/${projectToDelete.id}`));
        } catch (e) {
          console.warn("Database delete failed, deleting from local state only");
        }
        
        const updated = projects.filter((_, i) => i !== index);
        setProjects(updated);
        toast.success(lang === 'ko' ? '프로젝트가 삭제되었습니다.' : 'Project deleted.');
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error(lang === 'ko' ? '프로젝트 삭제 중 오류가 발생했습니다.' : 'Error deleting project.');
      }
    }
  };

  const services = [
    {
      title: lang === 'ko' ? "사용자 경험" : "User Experience",
      category: lang === 'ko' ? "UX 디자인" : "UX Design",
      imageUrl: "https://images.unsplash.com/photo-1588200908342-23b585c03e26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsaXN0JTIwdXglMjB1aSUyMGRlc2lnbiUyMHdvcmtzcGFjZSUyMGJlaWdlJTIwYWVzdGhldGljfGVufDF8fHx8MTc3NjY2Mzc0OXww&ixlib=rb-4.1.0&q=80&w=1080",
      description: lang === 'ko' 
        ? "우리는 사용자의 니즈를 깊이 이해하고, 단순한 시각적 아름다움을 넘어 최적의 사용 경험을 디자인합니다."
        : "We deeply understand user needs and design optimal experiences that go beyond mere visual beauty."
    },
    {
      title: lang === 'ko' ? "사용자 인터페이스" : "User Interface",
      category: lang === 'ko' ? "UI 디자인" : "UI Design",
      imageUrl: "https://images.unsplash.com/photo-1706368788255-ee5fa374744f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjbGVhbiUyMHVzZXIlMjBpbnRlcmZhY2UlMjBkZXNpZ24lMjBtb2NrdXAlMjBzdG9uZSUyMGdyYXl8ZW58MXx8fHwxNzc2NjYzNzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: lang === 'ko'
        ? "현대적이고 직관적인 인터페이스를 통해 브랜드의 가치를 시각적으로 전달하고 소통을 강화합니다."
        : "Through modern and intuitive interfaces, we visually communicate brand value and strengthen communication."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-gray-900 selection:bg-stone-200 selection:text-stone-900" style={{ fontFamily: 'var(--font-pretendard)' }}>
      <Navbar lang={lang} onToggleLang={toggleLang} onLoginClick={() => setIsLoginModalOpen(true)} />
      <main>
        <Hero 
          lang={lang}
          name={lang === 'ko' ? "윤다빈 디자이너" : "Designer Dabin Yoon"} 
          imageUrl="https://images.unsplash.com/photo-1765371514743-45bd8e6c0a28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBtaW5pbWFsaXN0JTIwZGVzaWduZXIlMjBvZmZpY2V8ZW58MXx8fHwxNzc2MTU1ODIxfDA" 
        />
        <Intro lang={lang} />
        {isLoading ? (
          <div className="py-32 text-center text-stone-400 font-bold">{lang === 'ko' ? '로딩 중...' : 'Loading...'}</div>
        ) : (
          <PortfolioGrid 
            lang={lang}
            projects={projects} 
            onAddClick={() => {
              setEditingIndex(null);
              setIsModalOpen(true);
            }} 
            onEdit={handleEditClick}
            onDelete={handleDeleteProject}
          />
        )}
        <ServicesSection lang={lang} services={services} />
      </main>
      <Footer lang={lang} />
      <Toaster position="bottom-right" expand={false} richColors />

      <AddProjectModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingIndex(null);
        }} 
        onAdd={handleAddProject} 
        initialData={editingIndex !== null ? projects[editingIndex] : null}
        mode={editingIndex !== null ? 'edit' : 'add'}
        lang={lang}
      />

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        lang={lang}
      />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
