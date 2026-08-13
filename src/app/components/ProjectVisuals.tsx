import React from 'react';
import { PlayCircle, Github } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Project } from '../context/ProjectsContext';

/** 제목이 같으면 항상 같은 색이 나오도록 문자열을 숫자로 접는다 */
const hashString = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const TONES = ['#EAE3DF', '#E6DED9', '#E1D8D2', '#EFEAE6', '#DCD3CD'];

/** 갤러리 1번째 이미지를 우선하고, 없으면 수동으로 넣은 썸네일 URL을 쓴다 */
export const resolveThumbUrl = (project: Project) => project.gallery?.[0] || project.imageUrl;

/**
 * 썸네일이 없거나 불러오지 못했을 때 제목으로 만들어내는 대체 화면.
 * 실제 이미지와 달리 원본 비율이 없으므로 자체적으로 세로 비율 박스를 갖는다.
 */
const GeneratedThumb = ({ project }: { project: Project }) => {
  const tone = TONES[hashString(project.title || '') % TONES.length];
  const initial = (project.title || '?').trim().charAt(0);

  return (
    <div
      className="w-full aspect-[4/5] flex flex-col items-center justify-center gap-2 select-none"
      style={{ backgroundColor: tone }}
      aria-hidden="true"
    >
      <span
        className="italic text-[#1A1512]/35 text-[clamp(3rem,7vw,5rem)] leading-none"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {initial}
      </span>
      {project.category && (
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1512]/30">
          {project.category}
        </span>
      )}
    </div>
  );
};

/**
 * 프로젝트 썸네일 — 이미지가 없거나 깨지면 자동 생성 화면으로 대체된다.
 * className에 고정 비율(aspect-*)을 넣지 않으면 이미지 원본 비율 그대로 렌더링된다
 * — 가로 이미지는 넓고 낮게, 세로 이미지는 좁고 길게, 잘리지 않고 표시된다.
 */
export const ProjectThumb = ({
  project,
  className = '',
}: {
  project: Project;
  className?: string;
}) => {
  const src = resolveThumbUrl(project);
  return (
    <ImageWithFallback
      src={src}
      alt={project.title}
      key={src}
      className={className}
      fallback={<GeneratedThumb project={project} />}
    />
  );
};

/** 프로토타입·GitHub 링크를 칩으로 보여준다. 링크가 없으면 아무것도 렌더링하지 않는다. */
export const ProjectChips = ({
  project,
  lang,
  className = '',
}: {
  project: Project;
  lang: 'ko' | 'en';
  className?: string;
}) => {
  if (!project.prototypeLink && !project.githubLink) return null;

  const chip =
    'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] font-bold transition-colors';

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {project.prototypeLink && (
        <a
          href={project.prototypeLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`${chip} border-[#810000]/30 text-[#810000] hover:bg-[#810000] hover:text-[#FAF9F7] hover:border-[#810000]`}
        >
          <PlayCircle className="size-3.5" />
          {lang === 'ko' ? '프로토타입' : 'Prototype'}
        </a>
      )}
      {project.githubLink && (
        <a
          href={project.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`${chip} border-[#1A1512]/25 text-[#1A1512]/70 hover:bg-[#1A1512] hover:text-[#FAF9F7] hover:border-[#1A1512]`}
        >
          <Github className="size-3.5" />
          GitHub
        </a>
      )}
    </div>
  );
};
