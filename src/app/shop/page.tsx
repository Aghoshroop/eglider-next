import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopBanner from "@/components/shop/ShopBanner";
import SidebarFilter from "@/components/shop/SidebarFilter";
import ProductGrid from "@/components/shop/ProductGrid";
import { Suspense } from "react";
import styles from "./page.module.css";

export const metadata = {
  title: "Shop Swimwear Collection | Eglider - Top Swimwear Manufacturer",
  description: "Browse the complete collection of Eglider elite racing suits, training gear, and accessories. Buy from the top swimwear manufacturer in Kolkata and West Bengal.",
  keywords: ["shop swimwear", "buy swimwear online", "swimwear collection", "top swimwear manufacturer", "racing suits", "training gear", "swim accessories", "custom swimwear kolkata"],
};

export default function ShopPage() {
  return (
    <div className={styles.shopLayout}>
      <Header />
      
      <main className={styles.mainContent}>
        {/* Full Bleed Shop Banner */}
        <ShopBanner />
        
        {/* Main Catalog Grid */}
        <div className={`container ${styles.gridContainer}`} style={{ marginTop: '60px' }}>
          <Suspense fallback={<div>Loading filters...</div>}>
            <SidebarFilter />
          </Suspense>
          <Suspense fallback={<div>Loading catalog...</div>}>
            <ProductGrid />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
