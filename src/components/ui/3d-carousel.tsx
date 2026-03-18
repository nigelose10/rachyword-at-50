"use client"

import { memo, useEffect, useLayoutEffect, useMemo, useState } from "react"
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
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) return defaultValue
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) return getMatches(query)
    return defaultValue
  })

  const handleChange = () => setMatches(getMatches(query))

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)
    handleChange()
    matchMedia.addEventListener("change", handleChange)
    return () => matchMedia.removeEventListener("change", handleChange)
  }, [query])

  return matches
}

const duration = 0.15
const transition = { duration, ease: [0.32, 0.72, 0, 1] }
const transitionOverlay = { duration: 0.5, ease: [0.32, 0.72, 0, 1] }

const Carousel = memo(
  ({
    handleClick,
    controls,
    cards,
    isCarouselActive,
    activeImg,
  }: {
    handleClick: (imgUrl: string, index: number) => void
    controls: ReturnType<typeof useAnimation>
    cards: string[]
    isCarouselActive: boolean
    activeImg: string | null
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
          onDragEnd={(_, info) =>
            isCarouselActive &&
            controls.start({
              rotateY: rotation.get() + info.velocity.x * 0.05,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 30,
                mass: 0.1,
              },
            })
          }
          animate={controls}
        >
          {cards.map((imgUrl, i) => {
            const isActive = activeImg === imgUrl;
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
                  className="pointer-events-none w-full rounded-xl object-cover aspect-square carousel-img"
                  style={{
                    filter: isActive ? 'grayscale(0) brightness(1)' : 'grayscale(1) brightness(0.6)',
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
  const controls = useAnimation()

  const cards = useMemo(() => images || [], [images])

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
            {/* Gold border frame around expanded image */}
            <motion.div
              className="relative p-[3px] rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #8B6914, #C9A96E, #F0E0B0, #C9A96E, #8B6914)',
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                layoutId={`img-${activeImg}`}
                src={activeImg}
                alt="DRA portrait"
                className="max-w-[85vw] max-h-[80vh] rounded-2xl object-contain"
                style={{ willChange: "transform" }}
              />
            </motion.div>

            {/* Close hint */}
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
          activeImg={activeImg}
        />
      </div>
    </motion.div>
  )
}

export { ThreeDPhotoCarousel }
