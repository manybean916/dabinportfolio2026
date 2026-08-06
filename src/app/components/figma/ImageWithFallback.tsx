import React, { useEffect, useRef, useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** src가 없거나 로드에 실패했을 때 대신 보여줄 내용 */
  fallback?: React.ReactNode
}

export function ImageWithFallback({ fallback, ...props }: Props) {
  const [didError, setDidError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const { src, alt, style, className, onLoad, onError, ...rest } = props

  // 캐시된 이미지는 onLoad가 발화하지 않을 수 있어 마운트·src 변경 시점에 직접 확인한다
  useEffect(() => {
    setDidError(false)
    const el = imgRef.current
    setLoaded(Boolean(el?.complete && el.naturalWidth > 0))
  }, [src])

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true)
    onLoad?.(e)
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setDidError(true)
    onError?.(e)
  }

  if ((didError || !src) && fallback !== undefined) {
    return <>{fallback}</>
  }

  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
        </div>
      </div>
    )
  }

  return (
    // 이미지가 준비되면 천천히 떠오르듯 나타난다.
    // 래퍼가 페이드를 맡아, 이미지에 걸린 호버 transform과 서로 간섭하지 않는다.
    <span
      className="block w-full h-full"
      style={{
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'scale(1)' : 'scale(1.04)',
        transition: 'opacity 900ms ease, transform 900ms cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: loaded ? 'auto' : 'opacity, transform',
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={className}
        style={style}
        loading="lazy"
        decoding="async"
        {...rest}
        onLoad={handleLoad}
        onError={handleError}
      />
    </span>
  )
}
