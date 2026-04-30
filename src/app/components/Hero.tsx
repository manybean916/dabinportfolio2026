import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroProps {
  name: string;
  imageUrl: string;
  lang: 'ko' | 'en';
}

export const Hero = ({ name, imageUrl, lang }: HeroProps) => {
  return (
    <section id="home" className="pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col items-center text-center gap-16">
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-8"
          style={{ fontFamily: 'var(--font-pretendard)' }}
        >
          <span className="flex flex-col items-center gap-4">
            <span className="text-[8vw] tracking-tight text-gray-900 leading-[0.9] block text-[36px] font-bold">
              {lang === 'ko' ? '윤다빈' : 'YOON DA BIN'}
            </span>
            <span className="font-medium text-stone-400 tracking-tight uppercase text-[20px] font-[Akatab]">
              Product Designer
            </span>
          </span>
          <span className="text-lg md:text-2xl font-medium text-stone-500 tracking-tight leading-relaxed max-w-[20rem] md:max-w-2xl block">
            {lang === 'ko' ? (
              <>사용자의 이탈을 막고 전환을 이끄는<br className="hidden md:block" /> '결정적인 한 끗'의 디테일에 집중합니다.</>
            ) : (
              <>Focusing on the 'decisive detail' that<br className="hidden md:block" /> prevents user churn and drives conversion.</>
            )}
          </span>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="w-full relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[40px] bg-stone-100 ring-1 ring-black/5"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1612123912968-5f6e964e8ea5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwdXglMjB1aSUyMGRlc2lnbmVyJTIwd29ya3NwYWNlJTIwYXBwbGUlMjBzdHVkaW8lMjBkaXNwbGF5JTIwYmVpZ2UlMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzc2NjYzODg3fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="UX UI Designer Workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};
