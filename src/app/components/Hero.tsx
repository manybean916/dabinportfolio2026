import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Mail, Github } from 'lucide-react';

interface HeroProps {
  lang: 'ko' | 'en';
}

// 부모가 자식들의 등장을 순차적으로 지휘한다
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};

// 마스크 뒤에서 밀려 올라오는 등장 — 바깥 래퍼가 잘라내고 안쪽이 위로 이동한다
const maskRise = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1.2, ease: [0.645, 0.045, 0.355, 1] as const } },
};

const riseUp = {
  hidden: { opacity: 0, y: 44 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const } },
};

/** 한 줄을 마스크로 감싸 슬라이드업시킨다. stagger 순서에 참여하도록 래퍼도 motion으로 둔다. */
const MaskLine = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div variants={{ hidden: {}, show: {} }} className={`overflow-hidden ${className}`}>
    <motion.div variants={maskRise}>{children}</motion.div>
  </motion.div>
);

export const Hero = ({ lang }: HeroProps) => {
  return (
    <section id="home" className="pt-36 pb-24 px-6 md:px-10 max-w-[1400px] mx-auto overflow-hidden">
      <motion.div variants={container} initial="hidden" animate="show">
        <MaskLine className="py-[0.2em]">
          <p className="text-center text-[11px] md:text-xs font-bold tracking-[0.35em] uppercase text-[#80605C]">
            Product Designer
          </p>
        </MaskLine>

        {/* leading이 0.85라 글자가 박스를 넘친다. 래퍼 em은 부모(16px) 기준이라
            글자 크기(12vw)에 비례하는 vw로 여백을 줘야 획이 잘리지 않는다 */}
        <MaskLine className="mt-6 w-full py-[1.6vw]">
          <h1
            className="text-center italic text-[#810000] leading-[0.85] tracking-[0.01em] text-[clamp(2.3rem,10vw,8.75rem)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            YOONDABIN
          </h1>
        </MaskLine>

        <MaskLine className="mt-14 py-[0.1em]">
          {/* ZEN Serif는 400 한 가지 굵기뿐이라 굵게 지정하지 않는다 (가짜 볼드 방지) */}
          <p
            className={`text-center mx-auto max-w-3xl text-[22px] md:text-[34px] leading-[1.5] text-[#1A1512]/70 break-keep ${
              lang === 'ko' ? '' : 'italic'
            }`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {lang === 'ko'
              ? '논리적인 설계와 감각적인 레이아웃의 균형을 추구합니다.'
              : 'Balancing logical structure with a refined sense of layout.'}
          </p>
        </MaskLine>

        <motion.div variants={riseUp} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#work"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#810000] text-[#FAF9F7] rounded-full text-sm font-bold hover:bg-[#1A1512] transition-colors"
          >
            View Work
            <span className="size-1.5 rounded-full bg-[#FAF9F7]" />
          </a>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=yoondabin916@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 border border-[#1A1512]/25 text-[#1A1512] rounded-full text-sm font-bold hover:bg-[#1A1512] hover:text-[#FAF9F7] hover:border-[#1A1512] transition-colors"
          >
            Contact Me
          </a>
        </motion.div>

        {/* 소셜 */}
        <motion.div
          variants={riseUp}
          className="mt-24 flex flex-col md:flex-row md:items-end md:justify-end gap-10 border-t border-[#1A1512]/15 pt-10"
        >
          <div className="flex flex-col gap-3 md:items-end shrink-0">
            {/* 장식용 라벨은 자간이 넓어야 어울려서 언어와 무관하게 영문으로 둔다 */}
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#1A1512]/45">
              Follow me
            </span>
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.instagram.com/bean.folder?stkn=ZXE0YXhvODZnZ29l&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-[#1A1512]/20 text-[#1A1512]/60 hover:bg-[#80605C] hover:text-[#FAF9F7] hover:border-[#80605C] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=yoondabin916@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-[#1A1512]/20 text-[#1A1512]/60 hover:bg-[#80605C] hover:text-[#FAF9F7] hover:border-[#80605C] transition-colors"
                aria-label="Email"
              >
                <Mail className="size-4" />
              </a>
              <a
                href="https://github.com/manybean916"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-[#1A1512]/20 text-[#1A1512]/60 hover:bg-[#80605C] hover:text-[#FAF9F7] hover:border-[#80605C] transition-colors"
                aria-label="GitHub"
              >
                <Github className="size-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
