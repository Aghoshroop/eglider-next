import Image from "next/image";
import Link from "next/link";
import styles from "./Categories.module.css";

const categories = [
  {
    id: "mens",
    title: "MEN",
    image: "/product_jammer_bright.png",
    link: "/shop?category=Mens"
  },
  {
    id: "womens",
    title: "WOMEN",
    image: "/product_kneeskin_bright.png",
    link: "/shop?category=Womens"
  },
  {
    id: "accessories",
    title: "ACCESSORIES",
    image: "/product_goggles_bright.png",
    link: "/shop?category=Accessories"
  }
];

export default function Categories() {
  return (
    <section className={styles.categoriesSection}>
      <div className={`container`}>
        <h2 className={styles.sectionTitle}>SHOP CATEGORIES</h2>
        <div className={styles.grid}>
          {categories.map((cat) => (
            <Link href={cat.link} key={cat.id} className={styles.card}>
              <div className={styles.imageContainer}>
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className={styles.overlay}></div>
              </div>
              <h3 className={styles.cardTitle}>{cat.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
