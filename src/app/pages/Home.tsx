import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { PortfolioGrid } from '../components/PortfolioGrid';
import { Footer } from '../components/Footer';
import { AddProjectModal } from '../components/AddProjectModal';
import { LoginModal } from '../components/LoginModal';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectsContext';
import { toast } from 'sonner';

interface HomeProps {
  lang: 'ko' | 'en';
  onToggleLang: () => void;
}

export const Home = ({ lang, onToggleLang }: HomeProps) => {
  const { isAdmin } = useAuth();
  const { projects, isLoading, saveProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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
      await saveProject(newProject, editingIndex);
      toast.success(
        editingIndex !== null
          ? (lang === 'ko' ? '프로젝트가 성공적으로 수정되었습니다.' : 'Project successfully updated.')
          : (lang === 'ko' ? '새 프로젝트가 추가되었습니다.' : 'New project added.')
      );
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
        await deleteProject(index);
        toast.success(lang === 'ko' ? '프로젝트가 삭제되었습니다.' : 'Project deleted.');
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error(lang === 'ko' ? '프로젝트 삭제 중 오류가 발생했습니다.' : 'Error deleting project.');
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-[#FAF9F7] text-[#1A1512] selection:bg-[#80605C] selection:text-[#FAF9F7]"
      style={{ fontFamily: 'var(--font-pretendard)' }}
    >
      <Navbar lang={lang} onToggleLang={onToggleLang} onLoginClick={() => setIsLoginModalOpen(true)} />
      <main>
        <Hero lang={lang} />
        {isLoading ? (
          <div className="py-32 text-center text-[#1A1512]/40 font-bold">
            {lang === 'ko' ? '로딩 중...' : 'Loading...'}
          </div>
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
      </main>
      <Footer lang={lang} />

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
