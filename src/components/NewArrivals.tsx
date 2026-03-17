"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, query, getDocs, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/data/mockProducts";
import styles from "./NewArrivals.module.css";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function NewArrivals() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Member Exclusive Products
  useEffect(() => {
    async function fetchExclusives() {
      try {
        let q = query(collection(db, "products"), where("highlight", "==", "Member Exclusive"), limit(4));
        let snapshot = await getDocs(q);
        let fetchedProducts: Product[] = [];
        
        snapshot.forEach(doc => {
          fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
        });

        // Fallback: If no exclusives found, just grab newest
        if (fetchedProducts.length === 0) {
          q = query(collection(db, "products"), limit(4));
          snapshot = await getDocs(q);
          snapshot.forEach(doc => {
            fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
          });
        }

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching member exclusives:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExclusives();
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    if (loading || products.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, { threshold: 0.1 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [loading, products]);

  return (
    <section className={styles.arrivalsSection}>
      <div className={`${styles.container} fade-in-section`} ref={containerRef}>
        <div className={styles.imageSide}>
          <Image 
            src="/about_bright.png" 
            alt="New arrivals athlete" 
            fill 
            className={styles.image}
            sizes="100vw"
          />
          <div className={styles.overlay}></div>
        </div>
        
        <div className={styles.contentSide}>
          <div className={styles.tag}>MEMBER EXCLUSIVE</div>
          <h2 className={styles.title}>MEMBER EXCLUSIVES / NEW</h2>
          <p className={styles.subtitle}>
            Unveiling our latest collection of hyper-engineered racewear. Limited availability for members only.
          </p>
          
          {loading ? (
             <div style={{padding: "20px 0"}}>
               <LoadingSpinner size="small" />
             </div>
          ) : (
             <ul className={styles.list}>
               {products.map((item, index) => (
                 <li key={item.id} className={styles.listItem} style={{ animationDelay: `${index * 0.15 + 0.5}s` }}>
                   <span className={styles.itemName}>{item.name}</span>
                   <span className={styles.itemPrice}>₹{item.price.toFixed(2)}</span>
                 </li>
               ))}
             </ul>
          )}
          
          <Link href="/shop" className={`btn-primary ${styles.btn}`}>
            SHOP EXCLUSIVES
          </Link>
        </div>
      </div>
    </section>
  );
}
