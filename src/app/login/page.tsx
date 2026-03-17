"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Global Email Capture
      try {
        const { db } = await import("@/lib/firebase");
        const { doc, setDoc } = await import("firebase/firestore");
        await setDoc(doc(db, "newsletter_subscribers", email), {
          email,
          subscribedAt: new Date().toISOString(),
          source: "Login"
        });
      } catch (e) {
        console.error("Failed to capture email in global list", e);
      }

      router.push("/account");
    } catch (err: any) {
      console.error("Login failed", err);
      // Determine if it might be an admin trying to login or standard invalid credentials
      if (err.code === "auth/invalid-credential") {
         setError("Invalid email or password.");
      } else {
         setError(err.message || "Failed to log in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
      <Header />
      <main className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.brand}>
            <h2>Welcome Back</h2>
            <p>Sign in to access your elite orders and wishlist.</p>
          </div>

          <form onSubmit={handleLogin} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            
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
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>
          
          <div className={styles.footer}>
            <p>Don't have an account? <Link href="/register" className={styles.link}>Create one</Link></p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
