import styles from "./OffersBanner.module.css";
import Link from "next/link";

export default function OffersBanner() {
  return (
    <div className={styles.banner}>
      <div className={`container ${styles.container}`}>
        <span className={styles.tag}>Limited Time</span>
        <p className={styles.text}>
          Experience the AquaGlide™ advantage. <strong>Free worldwide shipping</strong> on all elite racing suits.
        </p>
        <Link href="/shop" className={styles.link}>
          Shop Now &rarr;
        </Link>
      </div>
    </div>
  );
}
