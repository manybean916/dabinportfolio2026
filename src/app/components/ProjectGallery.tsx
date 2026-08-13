import React from 'react';
import { motion } from 'motion/react';

/**
 * 프로젝트 상세 페이지의 작업 과정 이미지들.
 * 캐러셀 대신 세로로 이어지는 스크롤 방식을 쓴다 — 사이트 전체가 스크롤로
 * 넘어가는 구조라, 클릭해야만 다음 장이 보이는 캐러셀은 화살표 존재를
 * 못 보고 첫 장만 보고 지나칠 위험이 있다.
 */
export const ProjectGallery = ({ images, lang }: { images: string[]; lang: 'ko' | 'en' }) => {
  if (images.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t border-[#1A1512]/15">
      <span className="text-xs font-bold text-[#80605C]">
        {lang === 'ko' ? '작업 과정' : 'Process'}
      </span>

      <div className="mt-8 space-y-16">
        {images.map((url, i) => (
          <motion.div
            key={url}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="block mb-3 text-lg italic text-[#810000]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="bg-[#1A1512]/[0.03]">
              <img
                src={url}
                alt={`${lang === 'ko' ? '작업 이미지' : 'Work image'} ${i + 1}`}
                className="w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
