import React from 'react';

/** 이미지 한 장. 로드되기 전에도 자리를 잡아둬서 스크롤 중 아래 내용이 밀리지 않는다. */
const GalleryImage = ({ url, alt }: { url: string; alt: string }) => {
  const [loaded, setLoaded] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  // 캐시된 이미지는 onLoad가 발화하지 않을 수 있어 마운트 시점에 직접 확인한다
  React.useEffect(() => {
    const el = imgRef.current;
    setLoaded(Boolean(el?.complete && el.naturalWidth > 0));
  }, [url]);

  return (
    <div className="bg-[#1A1512]/[0.03]">
      {/* 로드 전엔 이미지 자체에 16:9 비율을 줘서 자리를 잡고(스크롤 중 아래 내용이
          밀리지 않게), 로드되면 원본 비율(롱페이지처럼 세로로 긴 섹션 포함)로 바뀐다. */}
      <img
        ref={imgRef}
        src={url}
        alt={alt}
        className="block w-full h-auto transition-opacity duration-500"
        style={{ opacity: loaded ? 1 : 0, aspectRatio: loaded ? undefined : '16 / 9' }}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

/**
 * 프로젝트 상세 페이지의 최종 산출물.
 * 이미지 사이에 간격도, 장별 등장 애니메이션도 없이 위에서 아래로 한 장의 긴 페이지처럼
 * 이어 붙인다 — 슬라이드 여러 장이 아니라 하나의 연속된 문서로 읽히게 하려는 것이다.
 * 캐러셀 대신 세로 스크롤을 쓰는 이유는 사이트 전체가 스크롤 구조라, 클릭해야 다음 장이
 * 보이면 첫 장만 보고 지나칠 위험이 있기 때문이다. 라벨이나 번호도 붙이지 않는다.
 */
export const ProjectGallery = ({ images, lang }: { images: string[]; lang: 'ko' | 'en' }) => {
  if (images.length === 0) return null;

  return (
    <div className="mt-14 max-w-[1400px] mx-auto px-6 md:px-10">
      {images.map((url, i) => (
        <GalleryImage
          key={url}
          url={url}
          alt={`${lang === 'ko' ? '작업 이미지' : 'Work image'} ${i + 1}`}
        />
      ))}
    </div>
  );
};
