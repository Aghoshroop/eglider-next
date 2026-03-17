"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/data/mockProducts";
import styles from "./RelatedProducts.module.css";

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

export default function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const q = query(
          collection(db, "products"),
          where("category", "==", category),
          limit(5) // Fetch a few to ensure we have enough after filtering out the current one
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedProducts: Product[] = [];
        
        querySnapshot.forEach((doc) => {
          if (doc.id !== currentProductId) {
             fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
          }
        });
        
        // Take up to 4 related products
        setProducts(fetchedProducts.slice(0, 4));
      } catch (err) {
        console.error("Error fetching related products:", err);
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      fetchRelated();
    }
  }, [category, currentProductId]);

  if (loading) {
    return (
      <div className={styles.relatedContainer}>
        <div className={styles.loader}>Loading recommendations...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Don't show the section if no other products exist in category
  }

  return (
    <div className={styles.relatedContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Complete Your Kit</h2>
        <Link href="/shop" className={styles.viewAll}>View All {category}</Link>
      </div>
      
      <div className={styles.carouselContainer}>
        <div className={styles.carouselTrack}>
          {products.map(product => (
            <Link 
              href={`/product/${product.id}`} 
              key={product.id}
              className={styles.productCard}
            >
              <div className={styles.imageWrapper}>
                <Image 
                  src={product.images?.[0] || product.image || "/placeholder-image.jpg"} 
                  alt={product.name}
                  fill
                  className={styles.productImage}
                  sizes="(max-width: 768px) 80vw, 25vw"
                />
                {product.highlight && (
                  <span className={styles.badge}>{product.highlight}</span>
                )}
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                  <p className={styles.productCategory}>{product.level}</p>
                  <p style={{fontSize: "0.8rem", color: "#666", display: "flex", alignItems: "center", gap: "2px", margin: 0}}>
                     ⭐ {(product.rating || 4.5).toFixed(1)}/5
                  </p>
                </div>
                <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
