"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import Link from "next/link";
import styles from "./SearchModal.module.css";
import { Product } from "@/data/mockProducts";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch all products when modal opens to allow instant client-side filtering
  useEffect(() => {
    if (isOpen) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      if (allProducts.length === 0) {
        fetchProducts();
      }
    } else {
      setSearchTerm("");
      setResults([]);
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "products"));
      const querySnapshot = await getDocs(q);
      const fetched: Product[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Product);
      });
      setAllProducts(fetched);
    } catch (error) {
      console.error("Error fetching products for search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = allProducts.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.category.toLowerCase().includes(term) || 
      (p.description && p.description.toLowerCase().includes(term))
    );
    setResults(filtered.slice(0, 5)); // Limit to top 5 results
  }, [searchTerm, allProducts]);

  const suggestedTags = Array.from(new Set(allProducts.map(p => p.category))).filter(Boolean).slice(0, 6);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.searchHeader}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close search">
            &times;
          </button>
        </div>

        <div className={styles.resultsArea}>
          {isLoading ? (
            <div className={styles.loadingState}>Loading catalog...</div>
          ) : searchTerm.trim() && results.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No products found for "{searchTerm}"</p>
            </div>
          ) : results.length > 0 ? (
            <div className={styles.resultList}>
              <span className={styles.resultMeta}>PRODUCTS</span>
              {results.map(product => (
                <Link 
                  href={`/product/${product.id}`} 
                  key={product.id} 
                  className={styles.resultItem}
                  onClick={onClose}
                >
                  <div className={styles.itemImageWrapper}>
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      width={60} 
                      height={60} 
                      className={styles.itemImage}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <h4 className={styles.itemName}>{product.name}</h4>
                    <span className={styles.itemCategory}>{product.category}</span>
                    <span className={styles.itemPrice}>₹{product.price.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
              <div className={styles.viewAllWrapper}>
                 <Link href="/shop" className={styles.viewAllLink} onClick={onClose}>
                   View All Products &rarr;
                 </Link>
              </div>
            </div>
          ) : (
            <div className={styles.suggestedArea}>
              <span className={styles.resultMeta}>POPULAR CATEGORIES</span>
              <div className={styles.tagGrid}>
                {suggestedTags.length > 0 ? (
                  suggestedTags.map(tag => (
                    <button key={tag} className={styles.searchTag} onClick={() => setSearchTerm(tag)}>
                      {tag}
                    </button>
                  ))
                ) : (
                  <p style={{fontSize: '0.85rem', color: '#888'}}>Loading categories...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
