import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { ProjectThumb } from './ProjectVisuals';
import { useAuth } from '../context/AuthContext';
import type { Project } from '../context/ProjectsContext';

interface ProjectShowcaseProps {
  projects: Project[];
  onAddClick: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  lang: 'ko' | 'en';
}

// 폭이 100% → 72%(오른쪽 정렬) → 72%(왼쪽 정렬) 순으로 반복해서
// 한 줄에 하나씩 쌓이는 갤러리 벽에 리듬을 준다. 모바일은 항상 꽉 찬 폭이다.
const RHYTHM = ['md:w-full', 'md:w-[72%] md:ml-auto', 'md:w-[72%]'];

const ProjectItem = ({
  project,
  index,
  onEdit,
  onDelete,
  lang,
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
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${RHYTHM[index % 3]}`}
    >
      {isAdmin && (
        <div className="absolute top-4 right-4 z-30">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 bg-[#FAF9F7] hover:bg-white rounded-full shadow-md transition-colors text-[#1A1512]"
          >
            <MoreVertical className="size-4" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 mt-2 w-36 bg-[#FAF9F7] shadow-xl py-2 z-40 border border-[#1A1512]/10"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm font-bold text-[#1A1512] hover:bg-[#1A1512]/5 flex items-center gap-3 transition-colors"
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
                className="w-full px-4 py-2.5 text-left text-sm font-bold text-[#810000] hover:bg-[#810000]/10 flex items-center gap-3 transition-colors"
              >
                <Trash2 className="size-4" /> {lang === 'ko' ? '삭제하기' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      )}

      <Link to={`/project/${encodeURIComponent(project.id || '')}`} className="group block">
        {/* 슬라이드 첫 장이 16:9 그대로 보이고, 호버하면 천천히 확대된다 */}
        <div className="relative aspect-video overflow-hidden bg-[#1A1512]/[0.04]">
          <div className="absolute inset-0 transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]">
            <ProjectThumb project={project} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* 글은 한 줄만 — 번호·제목은 왼쪽, 카테고리는 오른쪽 */}
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3 min-w-0">
            <span className="italic text-[#810000]" style={{ fontFamily: 'var(--font-display)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-[15px] md:text-base font-semibold truncate group-hover:text-[#810000] transition-colors">
              {lang === 'en' && project.titleEn ? project.titleEn : project.title}
            </h3>
          </div>
          {project.category && (
            <span className="shrink-0 text-[11px] tracking-[0.15em] uppercase text-[#1A1512]/40">
              {project.category}
            </span>
          )}
        </div>
      </Link>
    </motion.article>
  );
};

export const ProjectShowcase = ({ projects, onAddClick, onEdit, onDelete, lang }: ProjectShowcaseProps) => {
  const { isAdmin } = useAuth();

  return (
    <section id="work" className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 md:pt-24 pb-28 md:pb-36">
      <div className="flex items-center justify-between gap-4 mb-10 md:mb-14">
        <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#1A1512]/50">Selected Work</p>

        <div className="flex items-center gap-5">
          <p className="text-[11px] font-bold tracking-[0.3em] text-[#1A1512]/35">
            {String(projects.length).padStart(2, '0')} Projects
          </p>
          {isAdmin && (
            <button
              onClick={onAddClick}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1512] text-[#FAF9F7] rounded-full text-xs font-bold hover:bg-[#80605C] transition-colors"
            >
              <Plus className="size-3.5" />
              {lang === 'ko' ? '새 프로젝트' : 'Add Project'}
            </button>
          )}
        </div>
      </div>

      {projects.length === 0 ? (
        <p className="py-24 text-center text-[#1A1512]/40 font-medium">
          {lang === 'ko' ? '아직 등록된 프로젝트가 없습니다.' : 'No projects yet.'}
        </p>
      ) : (
        <div className="flex flex-col gap-24 md:gap-32">
          {projects.map((project, index) => (
            <ProjectItem
              key={project.id || project.title + index}
              project={project}
              index={index}
              onEdit={() => onEdit(index)}
              onDelete={() => onDelete(index)}
              lang={lang}
            />
          ))}
        </div>
      )}
    </section>
  );
};
