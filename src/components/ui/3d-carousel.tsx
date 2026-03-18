"use client"

import { memo, useEffect, useLayoutEffect, useMemo, useState, useCallback } from "react"
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion"

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useMediaQuery(
  query: string,
  { defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) return defaultValue
    return window.matchMedia(query).matches
  }
  const [matches, setMatches] = useState<boolean>(() =>
    initializeWithValue ? getMatches(query) : defaultValue
  )
  const handleChange = () => setMatches(getMatches(query))
  useIsomorphicLayoutEffect(() => {
    const mq = window.matchMedia(query)
    handleChange()
    mq.addEventListener("change", handleChange)
    return () => mq.removeEventListener("change", handleChange)
  }, [query])
  return matches
}

const transitionOverlay = { duration: 0.5, ease: [0.32, 0.72, 0, 1] }

const Carousel = memo(
  ({
    handleClick,
    controls,
    cards,
    isCarouselActive,
    centeredIndex,
  }: {
    handleClick: (imgUrl: string, index: number) => void
    controls: ReturnType<typeof useAnimation>
    cards: string[]
    isCarouselActive: boolean
    centeredIndex: number
  }) => {
    const isScreenSizeSm = useMediaQuery("(max-width: 640px)")
    const cylinderWidth = isScreenSizeSm ? 1100 : 1800
    const faceCount = cards.length
    const faceWidth = cylinderWidth / faceCount
    const radius = cylinderWidth / (2 * Math.PI)
    const rotation = useMotionValue(0)
    const transform = useTransform(
      rotation,
      (value) => `rotate3d(0, 1, 0, ${value}deg)`
    )

    return (
      <div
        className="flex h-full items-center justify-center"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          drag={isCarouselActive ? "x" : false}
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
          style={{
            transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          onDrag={(_, info) =>
            isCarouselActive &&
            rotation.set(rotation.get() + info.offset.x * 0.05)
          }
          onDragEnd={(_, info) => {
            if (!isCarouselActive) return;
            const velocity = info.velocity.x * 0.05;
            const current = rotation.get() + velocity;
            // Snap to nearest face
            const snapAngle = 360 / faceCount;
            const snapped = Math.round(current / snapAngle) * snapAngle;
            controls.start({
              rotateY: snapped,
              transition: {
                type: "spring",
                stiffness: 80,
                damping: 20,
                mass: 0.1,
              },
            });
          }}
          animate={controls}
        >
          {cards.map((imgUrl, i) => {
            const isCentered = centeredIndex === i;
            return (
              <motion.div
                key={`key-${imgUrl}-${i}`}
                className="absolute flex h-full origin-center items-center justify-center rounded-xl p-2"
                style={{
                  width: `${faceWidth}px`,
                  transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
                }}
                onClick={() => handleClick(imgUrl, i)}
              >
                <img
                  src={imgUrl}
                  alt={`DRA portrait ${i + 1}`}
                  className={`pointer-events-none w-full rounded-xl object-cover aspect-square carousel-img ${isCentered ? 'carousel-img-active' : ''}`}
                  style={{
                    filter: isCentered ? 'grayscale(0) brightness(1)' : 'grayscale(1) brightness(0.55)',
                    transition: 'filter 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    )
  }
)

function ThreeDPhotoCarousel({ images }: { images?: string[] }) {
  const [activeImg, setActiveImg] = useState<string | null>(null)
  const [isCarouselActive, setIsCarouselActive] = useState(true)
  const [centeredIndex, setCenteredIndex] = useState(0)
  const controls = useAnimation()
  const cards = useMemo(() => images || [], [images])

  // Track which card is closest to center via rotation
  const updateCentered = useCallback(() => {
    // We need to read the current rotateY from the controls
    // Use a polling approach on the animated element
    const el = document.querySelector('[style*="rotate3d"]') as HTMLElement;
    if (!el) return;
    const style = el.style.transform || '';
    const match = style.match(/rotate3d\(0,\s*1,\s*0,\s*([-\d.]+)deg\)/);
    if (match) {
      const rot = parseFloat(match[1]);
      const faceCount = cards.length;
      const snapAngle = 360 / faceCount;
      // Normalize rotation to 0-360
      const normalized = ((rot % 360) + 360) % 360;
      // The face at index i is at angle i * snapAngle
      // The front-facing card has rotation closest to 0 (or 360)
      let closest = 0;
      let minDist = Infinity;
      for (let i = 0; i < faceCount; i++) {
        const faceAngle = (i * snapAngle) % 360;
        let dist = Math.abs(normalized - faceAngle);
        if (dist > 180) dist = 360 - dist;
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      }
      setCenteredIndex(closest);
    }
  }, [cards.length]);

  useEffect(() => {
    if (!isCarouselActive) return;
    const interval = setInterval(updateCentered, 100);
    return () => clearInterval(interval);
  }, [isCarouselActive, updateCentered]);

  const handleClick = (imgUrl: string) => {
    setActiveImg(imgUrl)
    setIsCarouselActive(false)
    controls.stop()
  }

  const handleClose = () => {
    setActiveImg(null)
    setIsCarouselActive(true)
  }

  return (
    <motion.div layout className="relative">
      <AnimatePresence mode="sync">
        {activeImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 flex items-center justify-center z-50 cursor-pointer"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(10,8,6,0.88), rgba(10,8,6,0.96))',
              backdropFilter: 'blur(20px)',
              willChange: "opacity",
            }}
            transition={transitionOverlay}
          >
            <motion.div
              className="relative p-[3px] rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #8B6914, #C9A96E, #F0E0B0, #C9A96E, #8B6914)',
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={activeImg}
                alt="DRA portrait"
                className="max-w-[85vw] max-h-[80vh] rounded-2xl object-contain"
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-8 text-[10px] uppercase tracking-[0.4em] text-gold/20 font-body"
            >
              Click anywhere to close
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative h-[500px] w-full overflow-hidden">
        <Carousel
          handleClick={handleClick}
          controls={controls}
          cards={cards}
          isCarouselActive={isCarouselActive}
          centeredIndex={centeredIndex}
        />
      </div>
    </motion.div>
  )
}

export { ThreeDPhotoCarousel }
