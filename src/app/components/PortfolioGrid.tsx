import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Project {
  title: string;
  titleEn?: string;
  category: string;
  imageUrl: string;
  link?: string;
  date?: string;
  collaborators?: string;
  keywords?: string[];
  subject?: string;
  workNotes?: string;
}

interface PortfolioGridProps {
  projects: Project[];
  onAddClick: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  lang: 'ko' | 'en';
}

const ProjectCard = ({ 
  project, 
  index, 
  onEdit, 
  onDelete,
  lang
}: { 
  project: Project; 
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  lang: 'ko' | 'en';
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const { isAdmin } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.15 }}
      className="group cursor-pointer relative"
    >
      <div className="relative aspect-[4/3] rounded-[32px] mb-6 bg-gray-100 shadow-sm ring-1 ring-black/5 hover:ring-black/10 transition-shadow">
        <div className="absolute inset-0 rounded-[32px] overflow-hidden">
          <ImageWithFallback
            src={project.imageUrl}
            alt={project.title}
            key={project.imageUrl} // Key added to force re-render when URL changes
            className="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-105"
            onClick={() => project.link && (window.location.href = project.link)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
        </div>
        
        {/* Menu Button */}
        {isAdmin && (
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2.5 bg-white/90 backdrop-blur-md hover:bg-white rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] transition-all text-gray-900 border border-gray-100"
            >
              <MoreVertical className="size-5" />
            </button>
            
            {showMenu && (
              <div 
                className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-2xl py-2 z-30 ring-1 ring-black/5"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  style={{ fontFamily: 'var(--font-pretendard)' }}
                >
                  <Edit2 className="size-4" /> {lang === 'ko' ? '수정하기' : 'Edit'}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  style={{ fontFamily: 'var(--font-pretendard)' }}
                >
                  <Trash2 className="size-4" /> {lang === 'ko' ? '삭제하기' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="space-y-2 px-2" onClick={() => project.link && (window.location.href = project.link)}>
        <h3
          className="text-xl font-bold tracking-tight text-gray-900"
          style={{ fontFamily: 'var(--font-pretendard)' }}
        >
          {lang === 'en' && project.titleEn ? project.titleEn : project.title}
        </h3>
        {project.category && (
          <p className="text-gray-400 font-medium">{project.category}</p>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500 font-medium">
          {project.date && <span>{project.date}</span>}
          <span>
            {project.collaborators && project.collaborators.trim()
              ? (lang === 'ko' ? `공동작업자: ${project.collaborators}` : `Collaborators: ${project.collaborators}`)
              : (lang === 'ko' ? '개인 작업' : 'Solo')}
          </span>
          {project.subject && <span className="truncate">· {project.subject}</span>}
        </div>
        {project.keywords && project.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.keywords.map((k) => (
              <span
                key={k}
                className="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-full text-[11px] font-medium"
              >
                #{k}
              </span>
            ))}
          </div>
        )}
        {project.workNotes && (
          <p className="text-sm text-stone-500 pt-1 line-clamp-2">{project.workNotes}</p>
        )}
      </div>
    </motion.div>
  );
};

export const PortfolioGrid = ({ projects, onAddClick, onEdit, onDelete, lang }: PortfolioGridProps) => {
  const { isAdmin } = useAuth();

  return (
    <section id="portfolio" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div className="space-y-4">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold tracking-widest text-stone-500 uppercase"
            style={{ fontFamily: 'var(--font-pretendard)' }}
          >
            {lang === 'ko' ? '선택된 작품들' : 'Selected Works'}
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold tracking-tight text-gray-900"
            style={{ fontFamily: 'var(--font-pretendard)' }}
          >
            {lang === 'ko' ? '포트폴리오 미리보기' : 'Portfolio Preview'}
          </motion.h2>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              onClick={onAddClick}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-2xl font-bold transition-all hover:bg-black active:scale-95 shadow-lg shadow-stone-200"
              style={{ fontFamily: 'var(--font-pretendard)' }}
            >
              <Plus className="size-5" />
              {lang === 'ko' ? '새 프로젝트 추가' : 'Add New Project'}
            </motion.button>
          )}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden md:flex items-center gap-2 font-bold tracking-tight text-gray-900"
            style={{ fontFamily: 'var(--font-pretendard)' }}
          >
            {lang === 'ko' ? '모든 프로젝트 보기' : 'View all projects'} <div className="size-2 bg-stone-400 rounded-full animate-bounce" />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.title + index} 
            project={project} 
            index={index}
            onEdit={() => onEdit(index)}
            onDelete={() => onDelete(index)}
            lang={lang}
          />
        ))}
      </div>
    </section>
  );
};
