"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/data/mockProducts";
import styles from "./ProductGrid.module.css";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    // We use onSnapshot here to listen to real-time changes
    const q = query(collection(db, "products"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedProducts: Product[] = [];
      querySnapshot.forEach((doc) => {
        fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(fetchedProducts);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching products from Firestore:", error);
        setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className={styles.productGrid}>
         <div className={styles.loadingState}>
            <LoadingSpinner size="large" />
            <p style={{marginTop: "1rem", color: "#666"}}>Loading catalog...</p>
         </div>
      </div>
    );
  }

  const activeCategories = searchParams.get("category")?.split(",").map(c => c.toLowerCase()) || [];
  const activeLevels = searchParams.get("level")?.split(",") || [];
  const activeSizes = searchParams.get("size")?.split(",") || [];
  const activeColors = searchParams.get("color")?.split(",") || [];

  const filteredProducts = products.filter(product => {
    let match = true;
    
    // Exact match for string fields, ignoring case for category for safety
    if (activeCategories.length > 0 && !activeCategories.includes(product.category.toLowerCase())) match = false;
    if (activeLevels.length > 0 && !activeLevels.includes(product.level)) match = false;
    
    // Array intersection for size/colors
    if (activeSizes.length > 0) {
      if (!product.sizes || !activeSizes.some(s => product.sizes!.includes(s))) match = false;
    }
    
    if (activeColors.length > 0) {
      if (!product.colors || !activeColors.some(c => product.colors!.includes(c))) match = false;
    }

    return match;
  });

  if (filteredProducts.length === 0) {
    return (
      <div className={styles.productGrid}>
         <div className={styles.emptyState}>No products match your active filters.</div>
      </div>
    );
  }

  return (
    <div className={styles.productGrid}>
      {filteredProducts.map((product) => {
        // Safe fallback for images: use the first image in the new array, or the old singular image string
        const primaryImage = product.images && product.images.length > 0 
          ? product.images[0] 
          : (product.image || "/placeholder-image.jpg");

        return (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.imageContainer}>
              <Link href={`/product/${product.id}`} className={styles.imageLink}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 480px) 50vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.productImage}
                  />
                  {/* Highlight Badge */}
                  {product.highlight && (
                    <span className={styles.badge}>{product.highlight}</span>
                  )}
                  {/* Level Tag Overlay */}
                  <div className={styles.levelTag}>{product.level}</div>
                </div>
              </Link>
            </div>
            
            <div className={styles.productInfo}>
              <div className={styles.metaRow}>
                <span className={styles.category}>{product.category}</span>
                <div className={styles.colors}>
                  {product.colors?.map(col => (
                    <span 
                      key={col} 
                      className={styles.colorDot} 
                      style={{backgroundColor: col}}
                    />
                  ))}
                </div>
              </div>
              
              <Link href={`/product/${product.id}`} className={styles.nameLink}>
                <h3 className={styles.productName}>{product.name}</h3>
              </Link>
              
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem"}}>
                <p className={styles.productPrice}>₹{product.price.toFixed(2)}</p>
                <p style={{fontSize: "0.8rem", color: "#666", display: "flex", alignItems: "center", gap: "2px", margin: 0}}>
                   ⭐ {(product.rating || 4.5).toFixed(1)}/5
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
