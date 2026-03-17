"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./MobileBottomNav.module.css";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Array of tabs for easy rendering. "href" matches the pathname to determine active state.
  const tabs = [
    {
      name: "Home",
      href: "/",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    {
      name: "Shop",
      href: "/shop",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      )
    },
    {
      name: "Tech",
      href: "/technology",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      )
    },
    {
      name: "About",
      href: "/about",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      )
    },
    {
      name: "Account",
      href: user ? "/account" : "/login",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    }
  ];

  return (
    <nav className={styles.bottomNav}>
      {tabs.map((tab) => {
        // Simple logic for active: If exact match "/", else if pathname starts with the href
        const isActive = tab.href === "/" 
          ? pathname === "/" 
          : pathname.startsWith(tab.href);

        return (
          <Link 
            key={tab.name} 
            href={tab.href} 
            className={`${styles.tab} ${isActive ? styles.active : ""}`}
          >
            <div className={styles.iconWrapper}>{tab.icon}</div>
            <span className={styles.label}>{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
