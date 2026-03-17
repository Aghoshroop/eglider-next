"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProductsShowcase.module.css";

const showcaseItems = [
  { id: 1, title: "Training Elite", desc: "Everyday excellence.", highlight: "Chlorine Resistant", image: "/product_jammer_bright.png", offset: 0 },
  { id: 2, title: "Race Day Speed", desc: "Podium proven technology.", highlight: "Ultra Compression", image: "/product_kneeskin_bright.png", offset: 40 },
  { id: 3, title: "Vision Perfected", desc: "Clarity at 100 meters.", highlight: "Anti-Fog Pro", image: "/product_goggles_bright.png", offset: 20 },
];

export default function ProductsShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.animateIn);
        }
      });
    }, { threshold: 0.1 });

    const kids = scrollRef.current?.children;
    if (kids) {
      for (let i = 0; i < kids.length; i++) {
        observer.observe(kids[i]);
      }
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.showcaseSection}>
      <div className={`container`}>
        <div className={styles.header}>
          <h2>TRENDING NOW</h2>
          <Link href="/shop" className="btn-outline">SHOP TRENDING</Link>
        </div>
        
        <div className={`${styles.track} hide-scrollbar`} ref={scrollRef}>
          {showcaseItems.map((item, i) => (
            <div 
              key={item.id} 
              className={styles.item}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className={styles.imageBox}>
                <Image src={item.image} alt={item.title} fill className={styles.image} sizes="(max-width: 768px) 100vw, 33vw"/>
                <span className={styles.highlightBadge}>{item.highlight}</span>
              </div>
              <div className={styles.info}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
