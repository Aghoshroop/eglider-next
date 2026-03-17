import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./about.module.css";
import Image from "next/image";

export const metadata = {
  title: "About Eglider Enterprise | Top Swimwear Manufacturer",
  description: "Learn about Eglider Enterprise, the leading swimwear manufacturer located in Palta, West Bengal. Discover our journey, manufacturing excellence, and commitment to athletes.",
};

export default function AboutPage() {
  return (
    <div className={styles.pageLayout}>
      <Header />
      
      <main className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={`container ${styles.heroContainer}`}>
            <h1 className={styles.heroTitle}>About Eglider</h1>
            <p className={styles.heroSubtitle}>
              Forging champion-grade swimwear from the heart of West Bengal.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className={styles.storySection}>
          <div className={`container ${styles.storyContainer}`}>
            <div className={styles.textContent}>
              <h2>Our Heritage & Manufacturing Excellence</h2>
              <p>
                Eglider Enterprise was born out of a singular vision: to provide athletes with uncompromising, world-class aquatic gear engineered right here in India. As a premier swimwear manufacturer, we oversee every step of the creation process—from raw material sourcing and hydrodynamic testing to the final precision stitching.
              </p>
              <p>
                Located in the industrial hub of Palta, West Bengal, our state-of-the-art facility combines decades of textile mastery with cutting-edge sports science. We don't just sew garments; we construct aquatic armor designed to shave milliseconds off your personal best. Whether you are a local club swimmer or an international competitor, Eglider is dedicated to elevating your performance in the water.
              </p>
              <div className={styles.statsRow}>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>10+</span>
                  <span className={styles.statLabel}>Years of Excellence</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>100%</span>
                  <span className={styles.statLabel}>In-House Production</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>50k+</span>
                  <span className={styles.statLabel}>Athletes Geared</span>
                </div>
              </div>
            </div>
            <div className={styles.imageContent}>
               <div className={styles.imageWrapper}>
                 <Image 
                   src="/hero_bright.png" 
                   alt="Eglider Manufacturing Excellence" 
                   fill 
                   className={styles.aboutImage}
                   style={{objectFit: "cover"}}
                 />
                 <div className={styles.imageOverlay}></div>
               </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className={styles.mapSection}>
          <div className={`container ${styles.mapContainer}`}>
             <div className={styles.mapHeader}>
                <h2>Visit Eglider Enterprise</h2>
                <p>Located in Palta, West Bengal. We welcome wholesale partners and distributors.</p>
             </div>
             <div className={styles.mapWrapper}>
                <iframe 
                  src="https://maps.google.com/maps?q=Glider+Enterprise+(BRAND+Name:-EGLIDER)&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{border: 0}} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Eglider Enterprise Location"
                ></iframe>
             </div>
             
             <div className={styles.contactInfo}>
                <div className={styles.contactCard}>
                   <h3>Headquarters & Factory</h3>
                   <p>Eglider Enterprise</p>
                   <p>Palta, North 24 Parganas</p>
                   <p>West Bengal, India</p>
                </div>
                <div className={styles.contactCard}>
                   <h3>Get in Touch</h3>
                   <p><strong>Email:</strong> gliderenterprise@gmail.com</p>
                   <p><strong>Phone:</strong> +91 9849157094</p>
                </div>
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
