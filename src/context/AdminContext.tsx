"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/data/mockProducts";
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "Pending Payment" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

interface AdminContextType {
  products: Product[];
  orders: Order[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updatedProduct: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    
    // Subscribe to Firestore for real-time updates (Products)
    const unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const fetchedProducts: Product[] = [];
      snapshot.forEach((doc) => {
        fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(fetchedProducts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products from Firestore:", error);
      setLoading(false);
    });

    // Subscribe to Firestore for real-time updates (Orders)
    const unsubscribeOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
      const fetchedOrders: Order[] = [];
      snapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
      });
      // Sort orders by most recent
      fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(fetchedOrders);
    }, (error) => {
      console.error("Error fetching orders from Firestore:", error);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, []);

  const addProduct = async (product: Product) => {
    try {
      // Ensure we have an ID for the product. If not, generate string
      const id = product.id || `prod-${Date.now()}`;
      await setDoc(doc(db, "products", id), { ...product, id });
    } catch (error) {
      console.error("Error adding product to Firestore:", error);
      throw error;
    }
  };

  const updateProduct = async (id: string, updatedProduct: Product) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, updatedProduct as any);
    } catch (error) {
      console.error("Error updating product in Firestore:", error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (error) {
      console.error("Error deleting product from Firestore:", error);
      throw error;
    }
  };

  if (!isClient) return null;

  return (
    <AdminContext.Provider value={{ products, orders, addProduct, updateProduct, deleteProduct, loading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
