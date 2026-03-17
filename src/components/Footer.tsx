import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.brand}>
          <h2 className={styles.logo}>eglider</h2>
          <p className={styles.subtitle}>
            Empowering professional swimming athletes with elite hydrodynamic sportswear.
          </p>
          <form className={styles.newsletter}>
            <input type="email" placeholder="JOIN THE ELITE (EMAIL)" required />
            <button type="submit">→</button>
          </form>
        </div>

        <div className={styles.links}>
          <div className={styles.column}>
            <h3>Shop</h3>
            <Link href="/shop/mens">Men's Racing</Link>
            <Link href="/shop/womens">Women's Racing</Link>
            <Link href="/shop/training">Training Gear</Link>
            <Link href="/shop/accessories">Accessories</Link>
          </div>
          <div className={styles.column}>
            <h3>Science</h3>
            <Link href="/technology">AquaGlide™</Link>
            <Link href="/sustainability">Sustainability</Link>
            <Link href="/athletes">Our Athletes</Link>
          </div>
          <div className={styles.column}>
            <h3>Support</h3>
            <Link href="/faq">FAQ</Link>
            <Link href="/sizing">Sizing Guide</Link>
            <Link href="/returns">Returns</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>&copy; {new Date().getFullYear()} eglider. All rights reserved.</p>
        <div className={styles.legalLinks}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
