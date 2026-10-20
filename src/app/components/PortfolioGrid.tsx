import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ProjectThumb, ProjectChips } from './ProjectVisuals';
import { Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Project } from '../context/ProjectsContext';

/**
 * 현재 브레이크포인트에 맞는 열 개수(1/2/3)를 추적한다.
 * CSS columns는 브라우저가 "열 높이를 균등하게" 맞추는 걸 우선하다 보니
 * 항목이 몇 개 없을 때 왼쪽 열은 텅 비워두고 오른쪽 열 하나에 몰아
 * 쌓는 등 예측 못 한 배치가 나온다. 열 개수를 직접 알고 있어야
 * 아이템을 좌→중→우로 순서대로 순환 배치할 수 있다.
 */
const useColumnCount = () => {
  const [count, setCount] = React.useState(3);

  React.useEffect(() => {
    const mqLg = window.matchMedia('(min-width: 1024px)');
    const mqMd = window.matchMedia('(min-width: 768px)');
    const update = () => setCount(mqLg.matches ? 3 : mqMd.matches ? 2 : 1);
    update();
    mqLg.addEventListener('change', update);
    mqMd.addEventListener('change', update);
    return () => {
      mqLg.removeEventListener('change', update);
      mqMd.removeEventListener('change', update);
    };
  }, []);

  return count;
};

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
      className="group relative"
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
        {/* 고정 비율을 강제하지 않는다 — 가로 이미지는 넓고 낮게, 세로 이미지는
            좁고 길게, 원본 비율 그대로 잘리지 않고 보인다 (썸네일이 없으면
            GeneratedThumb이 자체 aspect-[4/5]를 가진다) */}
        <div className="relative overflow-hidden bg-[#1A1512]/5">
          <ProjectThumb
            project={project}
            className="w-full h-auto block transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
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
  const columnCount = useColumnCount();

  // 좌→중→우 순서로 순환 배치한다. 각 열은 독립적으로 쌓이니 짧은
  // 카드 밑에 빈 공간이 남지 않으면서도, 5번째 카드는 다시 왼쪽 열로
  // 돌아와 처음 봤던 지그재그 리듬이 그대로 유지된다.
  const columns: { project: Project; index: number }[][] = Array.from(
    { length: columnCount },
    () => []
  );
  projects.forEach((project, index) => {
    columns[index % columnCount].push({ project, index });
  });

  return (
    <section id="work" className="pt-16 md:pt-20 pb-28 md:pb-36 px-6 md:px-10 max-w-[1400px] mx-auto">
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
        <div className="flex gap-x-10">
          {columns.map((col, c) => (
            <div
              key={c}
              // 가운데 열만 살짝 위로 당겨서 3열이 나란히 시작하는 딱딱한
              // 느낌 대신 지그재그 리듬을 만든다. 3열일 때만 의미가 있어
              // lg에서만 적용한다 (columnCount가 3일 때 실제 뷰포트도
              // lg 이상이므로 어긋나지 않는다).
              className={`flex-1 min-w-0 flex flex-col gap-y-20 ${
                columnCount === 3 && c === 1 ? 'lg:-mt-16' : ''
              }`}
            >
              {col.map(({ project, index }) => (
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
          ))}
        </div>
      )}
    </section>
  );
};
