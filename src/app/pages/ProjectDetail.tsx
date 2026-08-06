import React from 'react';
import { motion } from 'motion/react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, PlayCircle, Github } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Footer } from '../components/Footer';
import { useProjects } from '../context/ProjectsContext';

interface ProjectDetailProps {
  lang: 'ko' | 'en';
  onToggleLang: () => void;
}

export const ProjectDetail = ({ lang, onToggleLang }: ProjectDetailProps) => {
  const { id } = useParams();
  const { projects, isLoading } = useProjects();

  const index = projects.findIndex((p) => p.id === id);
  const project = index >= 0 ? projects[index] : undefined;
  const nextProject = projects.length > 1 ? projects[(index + 1) % projects.length] : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E7E6E4] flex items-center justify-center text-[#1A1512]/40 font-bold">
        {lang === 'ko' ? '로딩 중...' : 'Loading...'}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#E7E6E4] flex flex-col items-center justify-center gap-8 px-6 text-center">
        <p
          className="text-3xl italic text-[#1A1512]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {lang === 'ko' ? '프로젝트를 찾을 수 없습니다.' : 'Project not found.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#810000] text-[#E7E6E4] rounded-full text-sm font-bold hover:bg-[#1A1512] transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to work
        </Link>
      </div>
    );
  }

  const title = lang === 'en' && project.titleEn ? project.titleEn : project.title;
  // 한글엔 넓은 자간·uppercase가 어울리지 않아 영문일 때만 적용한다
  const labelCls = lang === 'ko'
    ? 'text-xs font-bold'
    : 'text-[11px] font-bold tracking-[0.25em] uppercase';
  const meta = [
    { label: lang === 'ko' ? '카테고리' : 'Category', value: project.category },
    { label: lang === 'ko' ? '날짜' : 'Date', value: project.date },
    {
      label: lang === 'ko' ? '참여' : 'Team',
      value: project.collaborators?.trim() || (lang === 'ko' ? '개인 작업' : 'Solo'),
    },
    { label: lang === 'ko' ? '과목 / 수업' : 'Subject', value: project.subject },
  ].filter((m) => m.value);

  return (
    <div
      className="min-h-screen bg-[#E7E6E4] text-[#1A1512] selection:bg-[#810000] selection:text-[#E7E6E4]"
      style={{ fontFamily: 'var(--font-pretendard)' }}
    >
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#E7E6E4]/90 backdrop-blur-md border-b border-[#1A1512]/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#1A1512] hover:text-[#80605C] transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
          <button
            onClick={onToggleLang}
            className="text-xs font-bold tracking-wider text-[#1A1512]/60 hover:text-[#1A1512] transition-colors"
          >
            <span className={lang === 'ko' ? 'text-[#810000]' : ''}>KR</span>
            <span className="mx-1.5 opacity-30">/</span>
            <span className={lang === 'en' ? 'text-[#810000]' : ''}>EN</span>
          </button>
        </div>
      </header>

      <main className="pt-36 pb-28">
        <article className="max-w-5xl mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={`${labelCls} text-[#80605C]`}>
              {project.category}
            </p>
            <h1 className="mt-6 text-[clamp(2.25rem,6vw,4.25rem)] font-bold leading-[1.1] break-keep">
              {title}
            </h1>

            {project.keywords && project.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {project.keywords.map((k) => (
                  <span
                    key={k}
                    className="px-4 py-1.5 border border-[#1A1512]/20 rounded-full text-xs font-medium text-[#1A1512]/70"
                  >
                    {k}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 aspect-[16/10] overflow-hidden bg-[#1A1512]/5"
          >
            <ImageWithFallback src={project.imageUrl} alt={title} className="w-full h-full object-cover" />
          </motion.div>

          {meta.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14 pt-10 border-t border-[#1A1512]/15">
              {meta.map((m) => (
                <div key={m.label} className="space-y-2">
                  <span className={`${labelCls} text-[#1A1512]/45`}>
                    {m.label}
                  </span>
                  <p className="text-base font-medium break-keep">{m.value}</p>
                </div>
              ))}
            </div>
          )}

          {(project.description || project.workNotes) && (
            <div className="mt-16 space-y-12">
              {project.description && (
                <section>
                  <h2 className={`${labelCls} text-[#80605C]`}>
                    {lang === 'ko' ? '프로젝트 개요' : 'Overview'}
                  </h2>
                  <p className="mt-5 text-lg md:text-xl leading-[1.75] text-[#1A1512]/80 whitespace-pre-line break-keep">
                    {project.description}
                  </p>
                </section>
              )}

              {project.workNotes && (
                <section>
                  <h2 className={`${labelCls} text-[#80605C]`}>
                    {lang === 'ko' ? '작업 노트' : 'Work Notes'}
                  </h2>
                  <p className="mt-5 text-lg md:text-xl leading-[1.75] text-[#1A1512]/80 whitespace-pre-line break-keep">
                    {project.workNotes}
                  </p>
                </section>
              )}
            </div>
          )}

          {(project.prototypeLink || project.githubLink) && (
            <div className="flex flex-wrap gap-3 mt-16 pt-10 border-t border-[#1A1512]/15">
              {project.prototypeLink && (
                <a
                  href={project.prototypeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#810000] text-[#E7E6E4] rounded-full text-sm font-bold hover:bg-[#1A1512] transition-colors"
                >
                  <PlayCircle className="size-4" />
                  {lang === 'ko' ? '프로토타입 보기' : 'View Prototype'}
                </a>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#1A1512]/25 rounded-full text-sm font-bold hover:bg-[#1A1512] hover:text-[#E7E6E4] transition-colors"
                >
                  <Github className="size-4" />
                  GitHub
                </a>
              )}
            </div>
          )}

          {nextProject && (
            <Link
              to={`/project/${encodeURIComponent(nextProject.id || '')}`}
              className="group flex items-center justify-between gap-6 mt-24 pt-10 border-t border-[#1A1512]/15"
            >
              <div>
                <span className={`${labelCls} text-[#1A1512]/45`}>
                  {lang === 'ko' ? '다음 프로젝트' : 'Next project'}
                </span>
                <p className="mt-3 text-2xl md:text-3xl font-bold break-keep group-hover:text-[#80605C] transition-colors">
                  {lang === 'en' && nextProject.titleEn ? nextProject.titleEn : nextProject.title}
                </p>
              </div>
              <span className="shrink-0 flex items-center justify-center size-14 rounded-full border border-[#1A1512]/25 group-hover:bg-[#80605C] group-hover:text-[#E7E6E4] group-hover:border-[#80605C] transition-colors">
                <ArrowRight className="size-5" />
              </span>
            </Link>
          )}
        </article>
      </main>

      <Footer lang={lang} />
    </div>
  );
};
