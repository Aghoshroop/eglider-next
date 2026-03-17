import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.imageWrapper}>
        <Image
          src="/hero_bright.png"
          alt="Elite professional swimmer in bright sparkling water"
          fill
          priority
          className={styles.image}
        />
        <div className={styles.overlay}></div>
      </div>
      
      <div className={`container ${styles.content}`}>
        <div className={styles.textStack}>
          <h1 className={styles.title}>
            <span className="text-reveal" style={{ animationDelay: "0.2s" }}>
              COMMAND
            </span>
            <span className="text-reveal" style={{ animationDelay: "0.4s" }}>
              THE WATER
            </span>
          </h1>
          
          <p className={styles.subtitle}>
            <span className="text-reveal" style={{ animationDelay: "0.6s" }}>
              Professional level swimwear engineered for elite athletes. Experience the crystal clear advantage.
            </span>
          </p>

          <div className={`text-reveal ${styles.ctaGroup}`} style={{ animationDelay: "0.8s" }}>
            <Link href="/shop?category=Mens" className="btn-primary">
              SHOP MEN
            </Link>
            <Link href="/shop?category=Womens" className="btn-primary">
              SHOP WOMEN
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span>Scroll</span>
        <div className={styles.scrollLine}></div>
      </div>
    </section>
  );
}
