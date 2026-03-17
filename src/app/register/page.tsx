"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "../login/login.module.css"; // Reuse login styles

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Initialize an empty user profile / settings document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
      });
      
      // Also prepare a base wishlist document for this user to exist safely
      await setDoc(doc(db, `users/${user.uid}/private`, "wishlist"), {
        items: []
      });

      // Global Email Capture
      try {
        await setDoc(doc(db, "newsletter_subscribers", email), {
          email,
          subscribedAt: new Date().toISOString(),
          source: "Registration"
        });
      } catch (e) {
        console.error("Failed to capture email in global list", e);
      }

      router.push("/account");
    } catch (err: any) {
      console.error("Registration failed", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else {
        setError(err.message || "Failed to create account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
      <Header />
      <main className={styles.loginContainer}>
        <div className={styles.loginCard} style={{maxWidth: "500px"}}>
          <div className={styles.brand}>
            <h2>Create Account</h2>
            <p>Join the elite tier of professional swimmers.</p>
          </div>

          <form onSubmit={handleRegister} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.inputGroup}>
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Michael Phelps"
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required 
                minLength={6}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required 
                minLength={6}
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "CREATING..." : "CREATE ACCOUNT"}
            </button>
          </form>
          
          <div className={styles.footer}>
            <p>Already have an account? <Link href="/login" className={styles.link}>Sign in</Link></p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
