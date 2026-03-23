"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/data/mockProducts";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useChat } from "@/context/ChatContext";
import styles from "./CleanDetailsPane.module.css";

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const ChevronDownIcon = ({ open }: { open?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

interface CleanDetailsPaneProps {
  product: Product;
}

export default function CleanDetailsPane({ product }: CleanDetailsPaneProps) {
  const [activeSize, setActiveSize] = useState<string>("S");
  const [descOpen, setDescOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(false);
  
  // Wishlist & Chat state
  const { user } = useAuth();
  const { setProductContext, openChat } = useChat();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  useEffect(() => {
    async function checkWishlist() {
      if (!user) return;
      try {
        const ref = doc(db, `users/${user.uid}/private`, "wishlist");
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().items?.includes(product.id)) {
          setIsWishlisted(true);
        } else {
          setIsWishlisted(false);
        }
      } catch (err) {
        console.error("Failed to check wishlist", err);
      }
    }
    checkWishlist();
  }, [user, product.id]);

  const toggleWishlist = async () => {
    if (!user) {
      router.push("/login"); // redirect to login if attempting to wishlist logged out
      return;
    }
    
    setIsWishlistLoading(true);
    try {
      const ref = doc(db, `users/${user.uid}/private`, "wishlist");
      if (isWishlisted) {
        await updateDoc(ref, { items: arrayRemove(product.id) });
        setIsWishlisted(false);
      } else {
        await updateDoc(ref, { items: arrayUnion(product.id) });
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error("Failed to update wishlist", err);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleEnquire = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setProductContext({
      id: product.id,
      name: product.name,
      image: product.image
    });
    openChat();
  };

  return (
    <div className={styles.detailsPane}>
      {/* Category Pill */}
      <div className={styles.categoryPill}>
        {product.category} {product.level}
      </div>

      {/* Title & Price */}
      <h1 className={styles.title}>{product.name}</h1>
      <p className={styles.price}>₹{product.price.toFixed(2)}</p>

      {/* Delivery Bar */}
      <div className={styles.deliveryBar}>
        <ClockIcon />
        <span>Order in <b>02:30:25</b> to get next day delivery</span>
      </div>

      {/* Size Selection */}
      <div className={styles.sizeSection}>
        <span className={styles.label}>Select Size</span>
        <div className={styles.sizeGrid}>
          {(product.sizes || ["S", "M", "L", "XL", "XXL"]).map(size => (
            <button
              key={size}
              className={`${styles.sizePill} ${activeSize === size ? styles.activeSize : ''}`}
              onClick={() => setActiveSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actionRow}>
        <button className={styles.addToCartBtn} onClick={handleEnquire}>
          Enquire
        </button>
        <button 
          className={styles.wishlistBtn} 
          aria-label="Toggle wishlist" 
          onClick={toggleWishlist}
          disabled={isWishlistLoading}
          style={isWishlisted ? { color: "#e11d48", borderColor: "#e11d48" } : {}}
        >
          <HeartIcon filled={isWishlisted} />
        </button>
      </div>

      {/* Accordions */}
      <div className={styles.accordions}>
        <div className={styles.accordionGroup}>
          <button className={styles.accordionTrigger} onClick={() => setDescOpen(!descOpen)}>
            <span>Description & Fit</span>
            <ChevronDownIcon open={descOpen} />
          </button>
          <div className={`${styles.accordionContent} ${descOpen ? styles.contentOpen : ''}`}>
            {product.highlight && <p><strong>Key Feature:</strong> {product.highlight}</p>}
            {product.description ? (
               <p style={{ whiteSpace: "pre-wrap" }}>{product.description}</p>
            ) : (
               <p>Loose-fit sweatshirt hoodie in medium weight cotton-blend fabric with a generous, but not oversized silhouette. Premium athletic wear engineered for everyday transition.</p>
            )}
          </div>
        </div>

        <div className={styles.accordionGroup}>
          <button className={styles.accordionTrigger} onClick={() => setShippingOpen(!shippingOpen)}>
            <span>Shipping</span>
            <ChevronDownIcon open={shippingOpen} />
          </button>
          <div className={`${styles.accordionContent} ${shippingOpen ? styles.contentOpen : ''}`}>
            <div className={styles.shippingGrid}>
               <div className={styles.shipItem}>
                 <span className={styles.shipLabel}>Package</span>
                 <strong className={styles.shipValue}>Regular Package</strong>
               </div>
               <div className={styles.shipItem}>
                 <span className={styles.shipLabel}>Delivery Time</span>
                 <strong className={styles.shipValue}>5 to 7 Business Days</strong>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
