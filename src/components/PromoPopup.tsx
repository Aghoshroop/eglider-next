"use client";

import { useState, useEffect } from "react";
import styles from "./PromoPopup.module.css";

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Only show if the user hasn't seen it recently
    const hasSeenPromo = localStorage.getItem("eglider_promo_seen");
    
    if (!hasSeenPromo) {
      // Delay the popup so it doesn't instantly block the user when they land
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem("eglider_promo_seen", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      
      try {
        const { db } = await import("@/lib/firebase");
        const { doc, setDoc } = await import("firebase/firestore");
        
        await setDoc(doc(db, "newsletter_subscribers", email), {
          email,
          subscribedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Failed to save email", err);
      }

      setTimeout(() => {
        closePopup();
      }, 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popupCard}>
        <button onClick={closePopup} className={styles.closeBtn} aria-label="Close popup">
          &times;
        </button>
        
        {!submitted ? (
          <>
            <div className={styles.textContent}>
              <h2>Join the Elite</h2>
              <p>Sign up to our newsletter and get <strong>15% off</strong> your first order of professional training gear.</p>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
              <button type="submit" className={styles.submitBtn}>
                CLAIM OFFER
              </button>
            </form>
            <button onClick={closePopup} className={styles.declineBtn}>
              No thanks, I'll pay full price.
            </button>
          </>
        ) : (
          <div className={styles.successContent}>
            <h3>Welcome to eglider.</h3>
            <p>Your 15% discount code has been sent to your email.</p>
          </div>
        )}
      </div>
    </div>
  );
}
