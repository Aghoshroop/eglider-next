"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "./SidebarFilter.module.css";

const categories = ["Mens", "Womens", "Accessories", "Tech Suits", "Goggles", "Bags"];
const sizes = ["S", "M", "L", "XL", "28", "30", "32"];
const colors = ["#000000", "#ffffff", "#1a365d", "#e11d48", "#3b82f6"];
const levels = ["Elite", "Training", "Recreation"];

export default function SidebarFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [activeSections, setActiveSections] = useState<string[]>(["Category", "Performance Level"]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getArrayParam = (key: string) => {
    const val = searchParams.get(key);
    return val ? val.split(",") : [];
  };

  const handleFilterToggle = (key: string, value: string) => {
    const currentList = getArrayParam(key);
    let newList = [];
    
    if (currentList.includes(value)) {
      newList = currentList.filter(v => v !== value);
    } else {
      newList = [...currentList, value];
    }

    const params = new URLSearchParams(searchParams.toString());
    
    if (newList.length > 0) {
      params.set(key, newList.join(","));
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  const toggleSection = (section: string) => {
    setActiveSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  if (!mounted) return null; // Prevent hydration errors with search params

  const activeCategories = getArrayParam("category");
  const activeLevels = getArrayParam("level");
  const activeSizes = getArrayParam("size");
  const activeColors = getArrayParam("color");

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Filters</h2>
        <button className={styles.clearBtn} onClick={clearAll}>Clear All</button>
      </div>

      <div className={styles.filtersWrapper}>
        {/* Categories Section */}
        <div className={styles.section}>
          <button className={styles.accordionBtn} onClick={() => toggleSection("Category")}>
            <span>Category</span>
            <span className={styles.icon}>{activeSections.includes("Category") ? "−" : "+"}</span>
          </button>
          
          {activeSections.includes("Category") && (
            <div className={styles.content}>
              {categories.map(cat => (
                <label key={cat} className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    className={styles.checkbox} 
                    checked={activeCategories.includes(cat)}
                    onChange={() => handleFilterToggle("category", cat)}
                  />
                  <span className={styles.labelText}>{cat}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Performance Level Section */}
        <div className={styles.section}>
          <button className={styles.accordionBtn} onClick={() => toggleSection("Performance Level")}>
            <span>Performance Level</span>
            <span className={styles.icon}>{activeSections.includes("Performance Level") ? "−" : "+"}</span>
          </button>
          
          {activeSections.includes("Performance Level") && (
            <div className={styles.content}>
              {levels.map(level => (
                <label key={level} className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    className={styles.checkbox} 
                    checked={activeLevels.includes(level)}
                    onChange={() => handleFilterToggle("level", level)}
                  />
                  <span className={styles.labelText}>{level}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Size Array Section */}
        <div className={styles.section}>
          <button className={styles.accordionBtn} onClick={() => toggleSection("Size")}>
            <span>Size</span>
            <span className={styles.icon}>{activeSections.includes("Size") ? "−" : "+"}</span>
          </button>
          
          {activeSections.includes("Size") && (
            <div className={styles.sizeGrid}>
              {sizes.map(size => (
                <button 
                  key={size} 
                  className={styles.sizeBtn}
                  style={{
                    backgroundColor: activeSizes.includes(size) ? "var(--foreground)" : "var(--surface)",
                    color: activeSizes.includes(size) ? "var(--background)" : "var(--foreground)"
                  }}
                  onClick={() => handleFilterToggle("size", size)}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Swatch Section */}
        <div className={styles.section}>
          <button className={styles.accordionBtn} onClick={() => toggleSection("Color")}>
            <span>Color</span>
            <span className={styles.icon}>{activeSections.includes("Color") ? "−" : "+"}</span>
          </button>
          
          {activeSections.includes("Color") && (
            <div className={styles.colorGrid}>
              {colors.map(color => (
                <button 
                  key={color} 
                  className={styles.colorBtn} 
                  style={{ 
                    backgroundColor: color,
                    borderColor: activeColors.includes(color) ? "black" : "transparent",
                    transform: activeColors.includes(color) ? "scale(1.15)" : "scale(1)"
                  }}
                  aria-label={`Filter by color ${color}`}
                  onClick={() => handleFilterToggle("color", color)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
