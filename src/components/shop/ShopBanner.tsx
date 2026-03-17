import Image from "next/image";
import styles from "./ShopBanner.module.css";

export default function ShopBanner() {
  return (
    <div className={styles.bannerContainer}>
      <Image
        src="/about_bright.png" // Reusing an existing wide image for the mockup
        alt="Elite gear splash"
        fill
        className={styles.bannerImage}
        sizes="100vw"
        priority
      />
      <div className={styles.overlay}></div>
      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>PERFORMANCE GEAR</h1>
        <p className={styles.subtitle}>
          Engineered for speed. Built for the elite. Explore our full collection of hydrodynamic racewear and professional equipment.
        </p>
      </div>
    </div>
  );
}
