import React from 'react';
import { motion } from 'motion/react';

/**
 * 프로젝트 상세 페이지의 최종 산출물 슬라이드.
 * 캐러셀 대신 세로로 이어지는 스크롤 방식을 쓴다 — 사이트 전체가 스크롤로
 * 넘어가는 구조라, 클릭해야만 다음 장이 보이는 캐러셀은 화살표 존재를
 * 못 보고 첫 장만 보고 지나칠 위험이 있다.
 * 개별 단계가 아니라 하나로 이어지는 문서라 라벨이나 번호를 붙이지 않는다.
 */
export const ProjectGallery = ({ images, lang }: { images: string[]; lang: 'ko' | 'en' }) => {
  if (images.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t border-[#1A1512]/15 space-y-16">
      {images.map((url, i) => (
        <motion.div
          key={url}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#1A1512]/[0.03]"
        >
          <img
            src={url}
            alt={`${lang === 'ko' ? '작업 이미지' : 'Work image'} ${i + 1}`}
            className="w-full h-auto"
            loading="lazy"
            decoding="async"
          />
        </motion.div>
      ))}
    </div>
  );
};
