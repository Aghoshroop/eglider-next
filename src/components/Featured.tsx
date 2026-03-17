"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, query, getDocs, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/data/mockProducts";
import styles from "./Featured.module.css";

export default function Featured() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEliteProducts() {
      try {
        // Try getting products where level === "Elite"
        let q = query(
          collection(db, "products"),
          where("level", "==", "Elite"),
          limit(4)
        );
        let snapshot = await getDocs(q);
        let fetchedProducts: Product[] = [];
        
        snapshot.forEach(doc => {
          fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
        });

        // Fallback: if no elite products, just get newest 4 products
        if (fetchedProducts.length === 0) {
          q = query(collection(db, "products"), limit(4));
          snapshot = await getDocs(q);
          snapshot.forEach(doc => {
            fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
          });
        }

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEliteProducts();
  }, []);

  return (
    <section id="collections" className={styles.featuredSection}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>ELITE COLLECTION</h2>
          <Link href="/shop" className="btn-outline">
            VIEW FULL GEAR
          </Link>
        </div>

        {loading ? (
          <div className={styles.loader}>Loading Elite Collection...</div>
        ) : products.length > 0 ? (
          <div className={styles.grid}>
            {products.map((product) => {
              const primaryImage = product.images && product.images.length > 0 
                ? product.images[0] 
                : (product.image || "/placeholder-image.jpg");
                
              return (
                <Link href={`/product/${product.id}`} key={product.id} className={styles.card}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={primaryImage}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                      className={styles.image}
                    />
                    {product.highlight && (
                      <span className={styles.highlightBadge}>{product.highlight}</span>
                    )}
                    <div className={styles.overlayGradient} />
                    
                    <div className={styles.detailsOverlay}>
                      <span className={styles.category}>{product.category}</span>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.price}>₹{product.price.toFixed(2)}</p>
                    </div>

                    <div className={styles.exploreArrow}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={styles.loader}>No products available.</div>
        )}
      </div>
    </section>
  );
}
