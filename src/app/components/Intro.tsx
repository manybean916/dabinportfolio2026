import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const MAIL = 'https://mail.google.com/mail/?view=cm&fs=1&to=yoondabin916@gmail.com';

// 부모가 자식들의 등장을 순차적으로 지휘한다
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

// 마스크 뒤에서 밀려 올라오는 등장 — 바깥 래퍼가 잘라내고 안쪽이 위로 이동한다
const maskRise = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1.2, ease: [0.645, 0.045, 0.355, 1] as const } },
};

const riseUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const } },
};

const MaskLine = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div variants={{ hidden: {}, show: {} }} className={`overflow-hidden ${className}`}>
    <motion.div variants={maskRise}>{children}</motion.div>
  </motion.div>
);

/**
 * 홈 맨 위의 짧은 소개. 이름과 직군은 왼쪽에, 연락처는 오른쪽에 둬서
 * 아래 작업 갤러리가 주인공으로 이어지게 한다.
 */
export const Intro = () => {
  const linkCls =
    'group inline-flex items-center gap-1.5 text-sm font-medium text-[#1A1512]/75 hover:text-[#810000] transition-colors';

  return (
    <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-32 md:pt-40">
      {/* 이름 크기를 이 컨테이너의 글자 크기로 정해두면, 아래 여백들을 em으로 줘도 항상 이름 크기에 비례한다.
          h1에는 text-[1em]을 꼭 줘야 한다 — 프로젝트 기본 스타일(theme.css)이 h1을 24px로 덮어서,
          안 주면 이 크기를 상속받지 못한다 */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-16 text-[clamp(2.25rem,6.5vw,5.75rem)]"
      >
        <div>
          {/* 마스크 상자는 글자 폭에 딱 맞게 줄어들어서, 이탤릭 끝 장식(마지막 N의 오른쪽 위)이
              폭 밖으로 나가면 잘린다. 그래서 h1 오른쪽에 글자 크기 비례 여백(pr-[0.15em])을 준다.
              세로는 leading이 0.85라 글자가 박스를 넘치므로 위아래 여백(0.185em)도 같은 방식으로 준다. */}
          <MaskLine className="py-[0.185em]">
            <h1
              className="italic text-[#810000] text-[1em] leading-[0.85] tracking-[0.01em] pr-[0.15em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              YOONDABIN
            </h1>
          </MaskLine>
          <MaskLine className="mt-3 py-0.5">
            <p className="text-[11px] md:text-xs font-bold tracking-[0.35em] uppercase text-[#80605C]">
              Product Designer
            </p>
          </MaskLine>
        </div>

        {/* 연락처는 이름 글자의 윗선과 같은 높이에서 시작한다.
            이름 글자 윗선은 마스크 위쪽에서 약 0.27em 아래(여백 0.185em + 줄 위쪽 여유 0.085em)이고,
            링크 글자(14px)는 줄 위쪽에서 약 4px 아래부터 시작하므로 그만큼 뺀다 */}
        <motion.div variants={riseUp} className="flex flex-col gap-2 md:items-end md:pt-[calc(0.27em-4px)]">
          <a href={MAIL} target="_blank" rel="noopener noreferrer" className={linkCls}>
            yoondabin916@gmail.com
            <ArrowUpRight className="size-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
          <a href="https://github.com/manybean916" target="_blank" rel="noopener noreferrer" className={linkCls}>
            GitHub
            <ArrowUpRight className="size-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};
