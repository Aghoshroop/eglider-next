"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import styles from "./login.module.css";

export default function AdminLogin() {
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
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Set the dummy cookie expected by middleware.ts
      document.cookie = "adminAuth=authenticated; path=/; max-age=86400;";
      
      // Successful login will redirect via ProtectedRoute, or we can push explicitly:
      router.push("/admin");
    } catch (err: any) {
      console.error("Login failed", err);
      // Generic error message for security, or specific Firebase messages context
      setError("Invalid credentials or login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.brand}>
          <h2>EGLIDER ADMIN</h2>
          <p>Restricted Access</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <label htmlFor="email">Admin Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@eglider.com"
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
              placeholder="*************"
              required 
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "AUTHORIZING..." : "AUTHORIZE"}
          </button>
        </form>
        
        <div className={styles.hint}>
          <p>Please enter your Firebase credentials.</p>
        </div>
      </div>
    </div>
  );
}
