"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Product } from "@/data/mockProducts";
import { uploadImageToImgBB } from "@/lib/imgbb";
import styles from "./ProductModal.module.css";
import loginStyles from "../../app/admin/login/login.module.css"; // Reuse input styles

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { addProduct, updateProduct } = useAdmin();
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    category: "Mens",
    level: "Training",
    price: 0,
    rating: 4.5,
    description: "",
    image: "", // Primary
    images: [], // All
  });
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [sizesList, setSizesList] = useState<string[]>([]);
  const [colorsList, setColorsList] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        rating: product.rating || 4.5,
        description: product.description || "",
        images: product.images || (product.image ? [product.image] : [])
      });
      setSizesList(product.sizes || []);
      setColorsList(product.colors || []);
    } else {
      setFormData({
        name: "",
        category: "Mens",
        level: "Training",
        price: 0,
        rating: 4.5,
        description: "",
        image: "",
        images: [],
      });
      setSizesList([]);
      setColorsList([]);
    }
    setImageFiles([]);
    setErrorMsg("");
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'price' || name === 'rating') ? parseFloat(value) || 0 : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleAddSize = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (sizeInput.trim() && !sizesList.includes(sizeInput.trim().toUpperCase())) {
      setSizesList([...sizesList, sizeInput.trim().toUpperCase()]);
    }
    setSizeInput("");
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizesList(sizesList.filter(s => s !== sizeToRemove));
  };

  const handleAddColor = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    const val = colorInput.trim();
    if (val && !colorsList.includes(val)) {
      setColorsList([...colorsList, val]);
    }
    setColorInput("");
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setColorsList(colorsList.filter(c => c !== colorToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setErrorMsg("");
    
    try {
      let finalImages = [...(formData.images || [])];
      
      // If new images were selected, upload them all to ImgBB concurrently
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(file => uploadImageToImgBB(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        finalImages = [...finalImages, ...uploadedUrls];
      }

      // If absolutely no image was provided, add a fallback
      if (finalImages.length === 0) {
        finalImages = ["/placeholder-image.jpg"];
      }
      
      const submitData = {
        ...formData,
        image: finalImages[0], // primary is always the first one
        images: finalImages,
        id: product?.id || `new-prod-${Date.now()}`,
        sizes: sizesList.length > 0 ? sizesList : ["M", "L", "XL"],
        colors: colorsList.length > 0 ? colorsList : ["#000"],
      } as Product;

      if (product) {
        await updateProduct(product.id, submitData);
      } else {
        await addProduct(submitData);
      }
      onClose();
    } catch (err: any) {
      console.error("Submission Error:", err);
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{product ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className={styles.closeBtn} disabled={isUploading}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          {errorMsg && <p style={{color: "var(--color-accent-red)", marginBottom: "1rem"}}>{errorMsg}</p>}
          
          <div className={loginStyles.inputGroup}>
            <label htmlFor="name">Product Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.row}>
            <div className={loginStyles.inputGroup} style={{flex: 1}}>
              <label htmlFor="category">Category</label>
              <select 
                id="category" 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className={styles.select}
              >
                <option value="Mens">Mens</option>
                <option value="Womens">Womens</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div className={loginStyles.inputGroup} style={{flex: 1}}>
              <label htmlFor="level">Level</label>
              <select 
                id="level" 
                name="level" 
                value={formData.level} 
                onChange={handleChange}
                className={styles.select}
              >
                <option value="Elite">Elite</option>
                <option value="Training">Training</option>
                <option value="Recreation">Recreation</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={loginStyles.inputGroup} style={{flex: 1}}>
              <label htmlFor="price">Price ($)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                step="0.01" 
                required 
              />
            </div>
            
            <div className={loginStyles.inputGroup} style={{flex: 1}}>
              <label htmlFor="rating">Rating (1-5)</label>
              <input 
                type="number" 
                id="rating" 
                name="rating" 
                value={formData.rating} 
                onChange={handleChange} 
                step="0.1"
                min="1"
                max="5"
                required 
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={loginStyles.inputGroup} style={{flex: 1}}>
              <label>Available Sizes</label>
              <div style={{display: "flex", gap: "8px", marginBottom: "8px"}}>
                <input 
                  type="text" 
                  value={sizeInput} 
                  onChange={(e) => setSizeInput(e.target.value)} 
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddSize(e); }}
                  placeholder="e.g. XL"
                  style={{flex: 1}}
                />
                <button type="button" onClick={handleAddSize} className={styles.addTagBtn}>Add</button>
              </div>
              <div className={styles.tagContainer}>
                {sizesList.map(s => (
                  <span key={s} className={styles.tagPill}>
                    {s}
                    <button type="button" onClick={() => handleRemoveSize(s)}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
            
            <div className={loginStyles.inputGroup} style={{flex: 1}}>
              <label>Available Colors</label>
              <div style={{display: "flex", gap: "8px", marginBottom: "8px"}}>
                <input 
                  type="text" 
                  value={colorInput} 
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddColor(e); }}
                  placeholder="#000000 or Red"
                  style={{flex: 1}}
                />
                <button type="button" onClick={handleAddColor} className={styles.addTagBtn}>Add</button>
              </div>
              <div className={styles.tagContainer}>
                {colorsList.map(c => (
                  <span key={c} className={styles.tagPill}>
                    <span className={styles.colorSwatch} style={{backgroundColor: c}}></span>
                    {c}
                    <button type="button" onClick={() => handleRemoveColor(c)}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={loginStyles.inputGroup}>
            <label htmlFor="description">Product Description</label>
            <textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={4}
              placeholder="Enter comprehensive product details here..."
              style={{
                width: "100%", padding: "0.75rem", borderRadius: "8px", 
                border: "1px solid #ddd", fontSize: "0.95rem", 
                fontFamily: "var(--font-inter)", resize: "vertical"
              }}
            />
          </div>
          
          <div className={loginStyles.inputGroup}>
            <label htmlFor="imageUpload">Product Gallery (Multiple Images)</label>
            <input 
              type="file" 
              id="imageUpload" 
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{marginTop: "0.5rem"}}
            />
            
            {/* Display currently attached images */}
            {formData.images && formData.images.length > 0 && (
               <div style={{marginTop: "1rem"}}>
                 <p style={{fontSize: "0.85rem", color: "#666", marginBottom: "0.5rem"}}>Current Gallery:</p>
                 <div style={{display: "flex", gap: "0.5rem", flexWrap: "wrap"}}>
                   {formData.images.map((imgUrl, i) => (
                     <img 
                       key={i} 
                       src={imgUrl} 
                       alt="Thumbnail" 
                       style={{width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px"}}
                     />
                   ))}
                 </div>
               </div>
            )}
            
            {/* Display user selected pending files */}
            {imageFiles.length > 0 && (
              <div style={{marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--color-primary)"}}>
                {imageFiles.length} new file(s) ready to upload.
              </div>
            )}
          </div>

          <div className={styles.modalFooter}>
           
            <button type="submit" className={styles.saveBtn} disabled={isUploading}>
               {isUploading ? "Uploading & Saving..." : "Save Product"}
            </button> <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={isUploading}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
