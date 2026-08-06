import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ProjectThumb, ProjectChips } from './ProjectVisuals';
import { Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Project } from '../context/ProjectsContext';

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

  const summary = project.description;

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.1 }}
      /* 가운데 열을 아래로 내려 엇갈린 리듬을 만든다 */
      className={`group relative ${index % 3 === 1 ? 'lg:mt-28' : ''}`}
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

      {/* 칩도 링크라서 카드 링크 안에 중첩되지 않도록 영역을 분리한다 */}
      <Link to={`/project/${encodeURIComponent(project.id || '')}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#1A1512]/5">
          <ProjectThumb
            project={project}
            className="w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-[#1A1512]/0 group-hover:bg-[#1A1512]/25 transition-colors duration-500 pointer-events-none" />
        </div>

        <div className="pt-6">
          <div className="flex items-baseline gap-4">
            <span
              className="text-lg italic text-[#810000]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            {project.category && (
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1512]/45">
                {project.category}
              </span>
            )}
          </div>

          <h3 className="mt-3 text-xl md:text-2xl font-bold text-[#1A1512] leading-snug break-keep group-hover:text-[#810000] transition-colors">
            {lang === 'en' && project.titleEn ? project.titleEn : project.title}
          </h3>

          {summary && (
            <p className="mt-3 text-sm leading-relaxed text-[#1A1512]/60 line-clamp-2 break-keep">
              {summary}
            </p>
          )}

          <div className="mt-5 flex items-center gap-2.5">
            {/* 한글엔 넓은 자간·uppercase가 어울리지 않아 영문일 때만 적용한다 */}
            <span
              className={`text-xs font-bold text-[#1A1512] group-hover:text-[#810000] transition-colors ${
                lang === 'ko' ? '' : 'text-[11px] tracking-[0.15em] uppercase'
              }`}
            >
              {lang === 'ko' ? '자세히 보기' : 'View Case'}
            </span>
            <span className="size-1.5 rounded-full bg-[#810000]" />
          </div>
        </div>
      </Link>

      <ProjectChips project={project} lang={lang} className="mt-4 px-0" />
    </motion.article>
  );
};

export const PortfolioGrid = ({ projects, onAddClick, onEdit, onDelete, lang }: PortfolioGridProps) => {
  const { isAdmin } = useAuth();

  return (
    <section id="work" className="py-28 md:py-36 px-6 md:px-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
        {/* 마스크 뒤에서 밀려 올라오는 등장 */}
        <div className="overflow-hidden py-[1vw]">
          <motion.h2
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.645, 0.045, 0.355, 1] }}
            className="italic text-[#1A1512] text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Projects
          </motion.h2>
        </div>

        {isAdmin && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onClick={onAddClick}
            className="flex items-center gap-2 px-6 py-3 bg-[#1A1512] text-[#FAF9F7] rounded-full text-sm font-bold hover:bg-[#80605C] transition-colors"
          >
            <Plus className="size-4" />
            {lang === 'ko' ? '새 프로젝트' : 'Add Project'}
          </motion.button>
        )}
      </div>

      {projects.length === 0 ? (
        <p className="py-24 text-center text-[#1A1512]/40 font-medium">
          {lang === 'ko' ? '아직 등록된 프로젝트가 없습니다.' : 'No projects yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-24">
          {projects.map((project, index) => (
            <ProjectCard
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
