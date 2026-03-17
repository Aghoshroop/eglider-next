"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/data/mockProducts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import ProductVisual from "@/components/product/ProductVisual";
import CleanDetailsPane from "@/components/product/CleanDetailsPane";
import RelatedProducts from "@/components/product/RelatedProducts"; 
import Link from "next/link";

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const fetchedProduct = { id: docSnap.id, ...docSnap.data() } as Product;
          
          if (!fetchedProduct.images || fetchedProduct.images.length === 0) {
            fetchedProduct.images = [fetchedProduct.image || "/placeholder-image.jpg"];
          }
          
          setProduct(fetchedProduct);
        } else {
          console.error("No such document!");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <main className={styles.cleanContainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <h2>Loading...</h2>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <main className={styles.cleanContainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <h2>Product not found.</h2>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <main className={styles.cleanContainer}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
           <Link href="/" className={styles.crumbLink}>Home</Link>
           <span className={styles.crumbSep}>•</span>
           <Link href="/shop" className={styles.crumbLink}>Shop</Link>
           <span className={styles.crumbSep}>•</span>
           <span className={styles.crumbCurrent}>{product.name}</span>
        </nav>

        {/* 50/50 Grid Layout */}
        <div className={styles.productSplitGrid}>
          {/* Left Side: Images */}
          <div className={styles.imageColumn}>
            <ProductVisual 
              images={product.images!}
              altText={product.name} 
            />
          </div>

          {/* Right Side: Details */}
          <div className={styles.detailsColumn}>
            <CleanDetailsPane product={product} />
          </div>
        </div>

        {/* Rating & Reviews Section Placeholder */}
        <section className={styles.reviewsSection}>
           {/* Detailed Reviews implementation will go here */}
           <h2 className={styles.sectionTitle}>Rating & Reviews</h2>
           <div className={styles.reviewsPlaceholder}>
              <div className={styles.bigRatingWrapper}>
                <span className={styles.bigRatingNum}>{(product.rating || 4.5).toFixed(1)}<span style={{fontSize: "1rem", color: "#888", fontWeight: 400}}>/5</span></span>
                <span style={{color: "#888", fontSize: "0.9rem"}}>(128 Reviews)</span>
              </div>
              <div className={styles.reviewBars}>
                 {/* Visual Mockup for rating bars */}
                 {[5,4,3,2,1].map((num) => {
                    const rating = Math.round(product.rating || 4.5);
                    let barWidth = "2%";
                    if (num === rating) barWidth = "80%";
                    else if (num === rating - 1 || num === rating + 1) barWidth = "15%";

                    return (
                      <div key={num} style={{display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", color: "#555"}}>
                         <span style={{width: "20px"}}>⭐ {num}</span>
                         <div style={{width: "150px", height: "4px", backgroundColor: "#eee", borderRadius: "2px"}}>
                            <div style={{width: barWidth, height: "100%", backgroundColor: "#111", borderRadius: "2px"}} />
                         </div>
                      </div>
                    );
                 })}
              </div>
           </div>
        </section>

      </main>

      {/* Layer 3: Cross Sell - Related Products */}
      <section className={styles.relatedSection}>
        <RelatedProducts category={product.category} currentProductId={product.id} />
      </section>

      <Footer />
    </div>
  );
}
