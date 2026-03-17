"use client";

import { useState } from "react";
import { Product } from "@/data/mockProducts";
import { motion } from "framer-motion";
import styles from "./GlassOverlay.module.css";

// Icons 
const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

interface GlassOverlayProps {
  product: Product;
  activeColor: string;
  onColorChange: (color: string) => void;
}

export default function GlassOverlay({ product, activeColor, onColorChange }: GlassOverlayProps) {
  const [activeSize, setActiveSize] = useState<string>("M");
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  return (
    <motion.div 
      className={styles.glassCard}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Category & Rating Row */}
      <div className={styles.topRow}>
        <span className={styles.categoryLabel}>{product.category} • {product.level}</span>
        <div className={styles.ratingBox}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
          </div>
          <span className={styles.reviewCount}>(128)</span>
        </div>
      </div>

      {/* Main Title & Price */}
      <h1 className={styles.productTitle}>{product.name}</h1>
      <p className={styles.productPrice}>${product.price.toFixed(2)}</p>

      {/* Color Selection */}
      <div className={styles.sectionBlock}>
        <h3 className={styles.sectionLabel}>Color Option</h3>
        <div className={styles.colorSwatches}>
          {product.colors.map(color => (
            <button
              key={color}
              className={`${styles.colorSwatch} ${activeColor === color ? styles.colorSwatchActive : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className={styles.sectionBlock}>
        <div className={styles.sizeHeader}>
          <h3 className={styles.sectionLabel}>Select Size</h3>
          <button className={styles.sizeGuideBtn}>Size Guide</button>
        </div>
        <div className={styles.sizeGrid}>
          {(product.sizes || ["S", "M", "L", "XL"]).map(size => (
            <button
              key={size}
              className={`${styles.sizeBtn} ${activeSize === size ? styles.sizeBtnActive : ''}`}
              onClick={() => setActiveSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Actions: Quantity + Enquire */}
      <div className={styles.actionRow}>
        <div className={styles.quantitySelector}>
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={styles.qtyBtn}>-</button>
          <span className={styles.qtyValue}>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className={styles.qtyBtn}>+</button>
        </div>
        
        <motion.button 
          className={styles.addToBagBtn}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Enquire Now
        </motion.button>
        
        <button 
          className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ''}`}
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <HeartIcon />
        </button>
      </div>

      {/* Accordion Details Placeholder */}
      <div className={styles.accordionContainer}>
        <div className={styles.accordionItem}>
          <p className={styles.accordionTitle}>Product Description <span>+</span></p>
        </div>
        <div className={styles.accordionItem}>
          <p className={styles.accordionTitle}>Materials & Care <span>+</span></p>
        </div>
        <div className={styles.accordionItem}>
          <p className={styles.accordionTitle}>Shipping Information <span>+</span></p>
        </div>
      </div>

    </motion.div>
  );
}
