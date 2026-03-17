import Image from "next/image";
import Link from "next/link";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="technology" className={styles.aboutSection}>
      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            Engineered By Science.<br />
            <span className={styles.highlight}>Forged by Champions.</span>
          </h2>
          <p className={styles.description}>
            Every micro-millimeter of eglider sportswear is rigorously tested in hyper-fluid dynamic chambers. Our proprietary <span style={{color: "var(--foreground)", fontWeight: 500}}>AquaGlide™</span> fabric technology reduces drag by up to 18%, returning that energy straight into your stroke.
          </p>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>-18%</span>
              <span className={styles.statLabel}>Water Drag</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>+24%</span>
              <span className={styles.statLabel}>Muscle Compression</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>Ultra</span>
              <span className={styles.statLabel}>Lightweight</span>
            </div>
          </div>
          <Link href="/technology" className="btn-primary">
            Read The Science
          </Link>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src="/about_bright.png"
            alt="Professional swimmer demonstrating eglider technology in bright water"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
