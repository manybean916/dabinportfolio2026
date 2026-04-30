import React from 'react';
import { motion } from 'motion/react';

interface IntroProps {
  lang: 'ko' | 'en';
}

export const Intro = ({ lang }: IntroProps) => {
  return (
    <section id="about" className="py-24 px-6 md:px-0">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full min-h-[700px] flex flex-col md:flex-row items-center gap-12 md:gap-24 relative overflow-hidden rounded-[80px] bg-[#F5F3EF] p-12 md:p-24"
      >
        {/* Left: Profile Image Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="w-full md:w-2/5 aspect-[4/5] relative z-10"
        >
          <div className="w-full h-full overflow-hidden rounded-[60px] shadow-2xl ring-1 ring-black/5">
            
          </div>
          {/* Decorative tag */}
          <div className="absolute -bottom-6 -right-6 bg-white px-8 py-4 rounded-full shadow-xl rotate-3">
            <span className="text-sm font-bold text-gray-900 tracking-wider">DESIGNER</span>
          </div>
        </motion.div>

        {/* Right: Introduction Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full md:w-3/5 z-10 space-y-12"
        >
          <div className="space-y-6">
            <p className="text-sm font-bold tracking-[0.2em] text-stone-400 uppercase">
              {lang === 'ko' ? '소개' : 'About Me'}
            </p>
            <h2 
              className="font-bold text-gray-900 leading-tight text-[32px] md:text-[42px]"
              style={{ fontFamily: 'var(--font-pretendard)' }}
            >
              {lang === 'ko' ? (
                <>브랜드의 아이덴티티를 유연한 인터랙션과<br /> 감각적인 UX로 시각화하는 디자이너,<br/><span className="text-stone-400">윤다빈</span> 입니다.</>
              ) : (
                <>Visualizing brand identity with<br /> flexible interactions and sensible UX,<br/>I am <span className="text-stone-400">Dabin Yoon</span>.</>
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-stone-200">
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest uppercase opacity-40">{lang === 'ko' ? '업무 시간' : 'Working Hours'}</span>
              <p className="text-lg font-medium text-gray-700">{lang === 'ko' ? '월-금 09:00 - 18:00' : 'Mon-Fri 09:00 - 18:00'}</p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest uppercase opacity-40">{lang === 'ko' ? '위치' : 'Location'}</span>
              <p className="text-lg font-medium text-gray-700">Gwanak-gu, Seoul</p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest uppercase opacity-40">{lang === 'ko' ? '연락처' : 'Contact'}</span>
              <p className="text-lg font-medium text-gray-700">yoondabin916@gmail.com</p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest uppercase opacity-40">{lang === 'ko' ? '전문 분야' : 'Focus'}</span>
              <p className="text-lg font-medium text-gray-700">{lang === 'ko' ? 'UX 리서치, 제품 디자인' : 'UX Research, Product'}</p>
            </div>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 size-64 bg-stone-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 size-64 bg-gray-200/40 rounded-full blur-3xl animate-pulse" />
      </motion.div>
    </section>
  );
};
