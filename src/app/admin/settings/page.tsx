"use client";

import styles from "../admin.module.css";
// Reusing some form styles from login for speed
import loginStyles from "../login/login.module.css";

export default function SettingsPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings saved successfully.");
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>System Settings</h1>

      <div className={styles.tableContainer} style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSave} className={loginStyles.form}>
          
          <div className={loginStyles.inputGroup}>
            <label htmlFor="storeName">Store Name</label>
            <input 
              type="text" 
              id="storeName" 
              defaultValue="eglider Professional Swimming Sportswear" 
            />
          </div>

          <div className={loginStyles.inputGroup}>
            <label htmlFor="contactEmail">Support Contact Email</label>
            <input 
              type="email" 
              id="contactEmail" 
              defaultValue="support@eglider.com" 
            />
          </div>

          <div className={loginStyles.inputGroup}>
            <label htmlFor="currency">Store Currency</label>
            <input 
              type="text" 
              id="currency" 
              defaultValue="USD ($)" 
              disabled
            />
            <span style={{fontSize: '0.8rem', color: '#888'}}>Currency cannot be changed while active orders exist.</span>
          </div>

          <button type="submit" className={styles.primaryBtn} style={{ marginTop: '20px' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
