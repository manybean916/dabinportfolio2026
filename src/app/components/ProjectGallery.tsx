import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * 프로젝트 상세 페이지의 작업 과정 슬라이드쇼.
 * embla-carousel-react를 직접 사용해 사이트 고유의 크림/버건디 톤으로 맞춘다
 * (shadcn Carousel 프리미티브는 이 리디자인의 다른 화면들과 스타일 체계가 달라 쓰지 않는다).
 */
export const ProjectGallery = ({ images, lang }: { images: string[]; lang: 'ko' | 'en' }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (images.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t border-[#1A1512]/15">
      <div className="flex items-baseline justify-between mb-6">
        <span className="text-xs font-bold text-[#80605C]">
          {lang === 'ko' ? '작업 과정' : 'Process'}
        </span>
        <span className="text-xs font-medium text-[#1A1512]/45">
          <span className="text-[#810000] font-bold">{selected + 1}</span> / {images.length}
        </span>
      </div>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((url, i) => (
              <div key={url} className="min-w-0 shrink-0 grow-0 basis-full">
                {/* 페이지마다 비율이 제각각이라 잘라내지 않고 그대로 보여준다 */}
                <div className="flex items-center justify-center bg-[#1A1512]/[0.03]">
                  <img
                    src={url}
                    alt={`${lang === 'ko' ? '작업 이미지' : 'Work image'} ${i + 1}`}
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
              aria-label={lang === 'ko' ? '이전 이미지' : 'Previous image'}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center size-10 rounded-full bg-[#FAF9F7]/90 border border-[#1A1512]/15 text-[#1A1512] hover:bg-[#1A1512] hover:text-[#FAF9F7] transition-colors disabled:opacity-0 disabled:pointer-events-none"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
              aria-label={lang === 'ko' ? '다음 이미지' : 'Next image'}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center size-10 rounded-full bg-[#FAF9F7]/90 border border-[#1A1512]/15 text-[#1A1512] hover:bg-[#1A1512] hover:text-[#FAF9F7] transition-colors disabled:opacity-0 disabled:pointer-events-none"
            >
              <ArrowRight className="size-4" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === selected ? 'w-6 bg-[#810000]' : 'w-1.5 bg-[#1A1512]/20 hover:bg-[#1A1512]/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
