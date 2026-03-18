"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminProvider } from "@/context/AdminContext";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import styles from "./layout.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If we are on the login page, we don't want the admin sidebar layout or protection
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear the dummy cookie used by middleware.ts
      document.cookie = "adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/admin/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <ProtectedRoute>
      <AdminProvider>
        <div className={styles.adminLayout}>
          <aside className={styles.sidebar}>
            <div className={styles.brand}>
              <h2>EGLIDER</h2>
              <span>COMMAND CENTER</span>
            </div>

            <nav className={styles.nav}>
              <Link 
                href="/admin" 
                className={`${styles.navLink} ${pathname === '/admin' ? styles.active : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/products" 
                className={`${styles.navLink} ${pathname === '/admin/products' ? styles.active : ''}`}
              >
                Catalog
              </Link>
              <Link 
                href="/admin/orders" 
                className={`${styles.navLink} ${pathname === '/admin/orders' ? styles.active : ''}`}
              >
                Orders
              </Link>
              <Link 
                href="/admin/enquiries" 
                className={`${styles.navLink} ${pathname === '/admin/enquiries' ? styles.active : ''}`}
              >
                Enquiries
              </Link>
              <Link 
                href="/admin/emails" 
                className={`${styles.navLink} ${pathname === '/admin/emails' ? styles.active : ''}`}
              >
                Emails
              </Link>
              <Link 
                href="/admin/settings" 
                className={`${styles.navLink} ${pathname === '/admin/settings' ? styles.active : ''}`}
              >
                Settings
              </Link>
            </nav>

            <div className={styles.sidebarFooter}>
              <Link href="/" className={styles.returnLink} target="_blank">View Live Site ↗</Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            </div>
          </aside>

          <main className={styles.mainContent}>
            <header className={styles.topbar}>
              <div className={styles.userSection}>
                <span>System Admin</span>
              </div>
            </header>
            <div className={styles.pageContent}>
              {children}
            </div>
          </main>
        </div>
      </AdminProvider>
    </ProtectedRoute>
  );
}
