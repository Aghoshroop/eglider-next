"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/data/mockProducts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./account.module.css";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AccountPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return;
      
      try {
        // Fetch User's wishlist items
        const wishlistRef = doc(db, `users/${user.uid}/private`, "wishlist");
        const wishlistSnap = await getDoc(wishlistRef);
        
        if (wishlistSnap.exists() && wishlistSnap.data().items?.length > 0) {
          const itemIds = wishlistSnap.data().items as string[];
          
          // Fetch the actual product details for each ID
          const productPromises = itemIds.map(id => getDoc(doc(db, "products", id)));
          const productSnaps = await Promise.all(productPromises);
          
          const fetchedProducts = productSnaps
            .filter(snap => snap.exists())
            .map(snap => ({ id: snap.id, ...snap.data() } as Product));
            
          setWishlistProducts(fetchedProducts);
        } else {
          setWishlistProducts([]); // Empty
        }
      } catch (err) {
        console.error("Error fetching account data:", err);
      } finally {
        setDataLoading(false);
      }
    }
    
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!user) return;
    try {
      const ref = doc(db, `users/${user.uid}/private`, "wishlist");
      await updateDoc(ref, { items: arrayRemove(productId) });
      setWishlistProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  const handleSignOut = async () => {
    await logout();
    router.push("/");
  };

  if (authLoading || (!user && dataLoading)) {
    return (
      <>
        <Header />
        <main className={styles.accountContainer} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
           <LoadingSpinner size="large" />
        </main>
        <Footer />
      </>
    );
  }

  if (!user) return null; // Let the useEffect redirect run

  return (
    <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
      <Header />
      <main className={styles.accountContainer}>
        <div className={styles.accountInner}>
          
          <div className={styles.accountHeader}>
            <h1 className={styles.welcomeHeading}>My Account</h1>
            <button onClick={handleSignOut} className={styles.signOutBtn}>Log Out</button>
          </div>

          <section>
            <h2 className={styles.sectionTitle}>My Wishlist</h2>
            
            {dataLoading ? (
              <div style={{textAlign: "center", padding: "40px"}}>
                <LoadingSpinner />
              </div>
            ) : wishlistProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Your wishlist is currently empty.</p>
                <Link href="/shop" style={{color: "#111", fontWeight: 600, display: "inline-block", marginTop: "10px"}}>Go to Shop</Link>
              </div>
            ) : (
              <div className={styles.wishlistGrid}>
                {wishlistProducts.map(product => {
                  const primaryImage = product.images?.[0] || product.image || "/placeholder-image.jpg";
                  return (
                    <div key={product.id} style={{display: "flex", flexDirection: "column"}}>
                      <Link href={`/product/${product.id}`} className={styles.productCard}>
                        <div className={styles.imageWrapper}>
                          <Image 
                            src={primaryImage} 
                            alt={product.name} 
                            fill 
                            sizes="(max-width: 768px) 100vw, 300px"
                            className={styles.productImage} 
                          />
                        </div>
                        <div className={styles.productInfo}>
                          <p className={styles.productPrice}>₹{product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                      <button 
                         onClick={() => handleRemoveFromWishlist(product.id)}
                         className={styles.removeBtn}
                      >
                         Remove from Wishlist
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
