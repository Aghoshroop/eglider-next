"use client";

import { useState } from "react";
import styles from "../admin.module.css";
import { useAdmin } from "@/context/AdminContext";
import ProductModal from "@/components/admin/ProductModal";
import { Product } from "@/data/mockProducts";

export default function ProductsPage() {
  const { products, deleteProduct, loading } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div>
      <div className={styles.headerActions}>
        <h1 className={styles.pageTitle} style={{marginBottom: 0}}>Product Catalog</h1>
        <button onClick={handleAdd} className={styles.primaryBtn} disabled={loading}>+ Add New Product</button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Level</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{textAlign: 'center', padding: "2rem"}}>Loading products from Firebase...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} style={{textAlign: 'center', padding: "2rem"}}>No products found. Add a product to get started!</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img 
                      src={product.images?.[0] || product.image || "/placeholder-image.jpg"} 
                      alt={product.name} 
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                  </td>
                  <td style={{fontWeight: 600}}>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₹{(product.price || 0).toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleEdit(product)} className={styles.actionBtn}>Edit</button>
                    <button onClick={() => handleDelete(product.id, product.name)} className={`${styles.actionBtn} ${styles.deleteBtn}`}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          product={editingProduct} 
        />
      )}
    </div>
  );
}
