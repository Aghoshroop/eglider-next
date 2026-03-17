"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./technology.module.css";

export default function TechnologyPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.animateIn);
        }
      });
    }, { threshold: 0.15 });

    const animatedElements = document.querySelectorAll(`.${styles.animateOnScroll}`);
    animatedElements.forEach(el => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className={styles.pageLayout}>
      <Header />
      
      <main className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroBackground}>
            <div className={styles.gridOverlay}></div>
          </div>
          <div className={`container ${styles.heroContainer}`}>
            <h1 className={`${styles.animateOnScroll} ${styles.heroTitle}`}>The Science of Speed</h1>
            <p className={`${styles.animateOnScroll} ${styles.heroSubtitle}`}>
              At Eglider, we don't just design swimwear. We engineer hydrodynamic armor optimized at the molecular level to defy drag and maximize thrust.
            </p>
          </div>
        </section>

        {/* Hydrodynamics Section */}
        <section className={styles.techSection}>
          <div className={`container ${styles.techContainer}`}>
            <div className={`${styles.textBlock} ${styles.animateOnScroll}`}>
              <div className={styles.techLabel}>Phase 01</div>
              <h2>Hydrodynamic Architecture</h2>
              <p>
                Water is dense. Every millimeter of exposed seam, every loose fold of fabric creates micro-vortices that pull you backward. Our proprietary <strong>AeroGlide™ Surface Technology</strong> mimics the dermal denticles of apex aquatic predators.
              </p>
              <ul className={styles.featureList}>
                <li><strong>Drag Reduction:</strong> Up to 18% less passive drag compared to standard elastane blends.</li>
                <li><strong>Flow Dynamics:</strong> Strategically mapped textured zones turbulent flow away from the body.</li>
              </ul>
            </div>
            <div className={`${styles.visualBlock} ${styles.animateOnScroll}`}>
              <div className={styles.scientificGraphic}>
                 <div className={styles.flowLine} style={{top: "20%", animationDelay: "0s"}}></div>
                 <div className={styles.flowLine} style={{top: "40%", animationDelay: "0.5s"}}></div>
                 <div className={styles.flowLine} style={{top: "60%", animationDelay: "1s"}}></div>
                 <div className={styles.flowLine} style={{top: "80%", animationDelay: "1.5s"}}></div>
                 <div className={styles.shield}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Compression Section */}
        <section className={`${styles.techSection} ${styles.altBackground}`}>
          <div className={`container ${styles.techContainer} ${styles.reverse}`}>
            <div className={`${styles.textBlock} ${styles.animateOnScroll}`}>
              <div className={styles.techLabel}>Phase 02</div>
              <h2>Warp-Knit Carbon Compression</h2>
              <p>
                Muscle oscillation causes fatigue and expends vital oxygen. Eglider suits feature a bi-directional warp-knit infused with carbon-fiber banding. This exoskeleton locks the core and aligns the kinetic chain.
              </p>
              <ul className={styles.featureList}>
                <li><strong>Oxygen Maximization:</strong> Compresses major muscle groups to accelerate venous return.</li>
                <li><strong>Kinetic Return:</strong> Carbon banding stores potential energy on the downkick and releases it on the upkick.</li>
              </ul>
            </div>
            <div className={`${styles.visualBlock} ${styles.animateOnScroll}`}>
               <div className={styles.compressionGraphic}>
                  <div className={styles.muscleLayer}></div>
                  <div className={styles.carbonBand} style={{transform: "rotate(45deg)", left: "20%"}}></div>
                  <div className={styles.carbonBand} style={{transform: "rotate(-45deg)", right: "20%"}}></div>
                  <div className={styles.gridScanner}></div>
               </div>
            </div>
          </div>
        </section>

        {/* Water Repellency Section */}
        <section className={styles.techSection}>
          <div className={`container ${styles.techContainer}`}>
            <div className={`${styles.textBlock} ${styles.animateOnScroll}`}>
              <div className={styles.techLabel}>Phase 03</div>
              <h2>Hydrophobic Nanocoating</h2>
              <p>
                A heavy suit is a slow suit. Eglider employs a plasma-deposited nanocoating that actively repels water molecules at the sub-atomic level. The suit doesn't just cut through water; it refuses to absorb it.
              </p>
              <ul className={styles.featureList}>
                <li><strong>Zero-Weight Gain:</strong> Fabric retains less than 2% of its weight in water after 60 minutes of submersion.</li>
                <li><strong>Thermal Regulation:</strong> Maintains core body temperature in cold pools.</li>
              </ul>
            </div>
            <div className={`${styles.visualBlock} ${styles.animateOnScroll}`}>
               <div className={styles.repellentGraphic}>
                 <div className={styles.droplet} style={{left: "30%", width: "20px", height: "20px", animationDelay: "0s"}}></div>
                 <div className={styles.droplet} style={{left: "50%", width: "30px", height: "30px", animationDelay: "0.3s"}}></div>
                 <div className={styles.droplet} style={{left: "70%", width: "15px", height: "15px", animationDelay: "0.6s"}}></div>
                 <div className={styles.surfaceFabric}></div>
               </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
