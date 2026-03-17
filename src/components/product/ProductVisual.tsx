"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ProductVisual.module.css";

interface ProductVisualProps {
  images: string[];
  altText: string;
}

// Framer motion variants for the horizontal slide
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  })
};

export default function ProductVisual({ images, altText }: ProductVisualProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  
  // Safe fallback if images array is empty or undefined
  const safeImages = images && images.length > 0 ? images : ["/placeholder-image.jpg"];
  
  // The index is wrapped around the length of the images array
  const imageIndex = Math.abs(page % safeImages.length);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const jumpToImage = (index: number) => {
    // Determine direction based on whether we are jumping forward or backward
    const newDirection = index > imageIndex ? 1 : -1;
    setPage([page + (index - imageIndex), newDirection]);
  };

  return (
    <div className={styles.visualContainer}>
      {/* Main Image Canvas */}
      <div className={styles.greyCanvas}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className={styles.imageWrapper}
          >
            <Image 
              src={safeImages[imageIndex]} 
              alt={`${altText} - View ${imageIndex + 1}`} 
              fill
              className={styles.productImage}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Prev/Next Arrows */}
        {safeImages.length > 1 && (
          <div className={styles.sliderControls}>
            <button className={styles.arrowBtn} onClick={() => paginate(-1)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button className={styles.arrowBtn} onClick={() => paginate(1)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        )}

        {/* Thumbnails Navigator INSIDE Canvas */}
        {safeImages.length > 1 && (
          <div className={styles.thumbnailTrack}>
            {safeImages.map((src, idx) => {
              const jumpToIdxFunc = () => jumpToImage(idx);
              return (
              <button
                key={idx}
                className={`${styles.thumbnailBtn} ${idx === imageIndex ? styles.thumbnailActive : ''}`}
                onClick={jumpToIdxFunc}
                aria-label={`Go to slide ${idx + 1}`}
              >
                <Image 
                  src={src} 
                  alt={`Thumbnail ${idx + 1}`} 
                  fill
                  className={styles.thumbnailImage}
                  sizes="80px"
                />
              </button>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
