export interface Product {
  id: string;
  name: string;
  category: "Mens" | "Womens" | "Accessories";
  price: number;
  highlight?: string;
  image: string; // Keep as primary/thumbnail for backwards compat
  images?: string[]; // New: support for multiple images
  colors: string[];
  sizes: string[];
  level: "Elite" | "Training" | "Recreation";
  rating?: number;
  description?: string;
}

export const mockProducts: Product[] = [
  {
    id: "mens-jam-elite-1",
    name: "AeroGlide Elite Jammer",
    category: "Mens",
    price: 349.00,
    highlight: "Carbon Core",
    image: "/product_jammer_bright.png",
    images: ["/product_jammer_bright.png"],
    colors: ["#000000", "#1a365d", "#7f1d1d"], // Black, Navy, Crimson
    sizes: ["22", "24", "26", "28", "30"],
    level: "Elite"
  },
  {
    id: "womens-knee-elite-1",
    name: "AeroGlide Elite Kneeskin",
    category: "Womens",
    price: 499.00,
    highlight: "Podium Proven",
    image: "/product_kneeskin_bright.png",
    images: ["/product_kneeskin_bright.png"],
    colors: ["#000000", "#1a365d"],
    sizes: ["20", "22", "24", "26", "28", "30"],
    level: "Elite"
  },
  {
    id: "acc-gog-pro-1",
    name: "HydroVision Pro Goggles",
    category: "Accessories",
    price: 85.00,
    highlight: "Anti-Fog Pro",
    image: "/product_goggles_bright.png",
    images: ["/product_goggles_bright.png"],
    colors: ["#ffffff", "#000000", "#3b82f6"],
    sizes: ["One Size"],
    level: "Elite"
  },
  {
    id: "mens-jam-train-1",
    name: "Endurance+ Jammer",
    category: "Mens",
    price: 65.00,
    image: "/product_jammer_bright.png",
    images: ["/product_jammer_bright.png"],
    colors: ["#000000", "#4b5563"],
    sizes: ["28", "30", "32", "34", "36"],
    level: "Training"
  },
  {
    id: "womens-swim-train-1",
    name: "Powerback One Piece",
    category: "Womens",
    price: 85.00,
    highlight: "Chlorine Resistant",
    image: "/product_kneeskin_bright.png", // reusing image for mockup
    images: ["/product_kneeskin_bright.png"],
    colors: ["#1a365d", "#000000", "#e11d48"],
    sizes: ["28", "30", "32", "34", "36", "38"],
    level: "Training"
  },
  {
    id: "acc-cap-elite-1",
    name: "Nimbus Dome Cap",
    category: "Accessories",
    price: 35.00,
    highlight: "Wrinkle Free",
    image: "/product_goggles_bright.png", // reusing image for mockup
    images: ["/product_goggles_bright.png"],
    colors: ["#ffffff", "#000000"],
    sizes: ["Medium", "Large"],
    level: "Elite"
  },
  {
    id: "mens-brief-train-1",
    name: "Velocity Brief",
    category: "Mens",
    price: 45.00,
    image: "/product_jammer_bright.png", // reusing
    images: ["/product_jammer_bright.png"],
    colors: ["#000000", "#e11d48", "#1d4ed8"], // Black, Rose, Blue
    sizes: ["28", "30", "32", "34", "36"],
    level: "Training"
  },
  {
    id: "womens-knee-train-1",
    name: "Active Kneesuit",
    category: "Womens",
    price: 110.00,
    image: "/product_kneeskin_bright.png", // reusing
    images: ["/product_kneeskin_bright.png"],
    colors: ["#000000", "#1a365d"],
    sizes: ["30", "32", "34", "36", "38", "40"],
    level: "Training"
  },
  {
    id: "acc-equip-train-1",
    name: "Power Paddles Pro",
    category: "Accessories",
    price: 28.00,
    image: "/product_goggles_bright.png", // reusing
    images: ["/product_goggles_bright.png"],
    colors: ["#f59e0b", "#3b82f6"],
    sizes: ["Medium", "Large"],
    level: "Training"
  },
  {
    id: "mens-jam-rec-1",
    name: "Leisure Aquashort",
    category: "Mens",
    price: 40.00,
    image: "/product_jammer_bright.png", // reusing
    images: ["/product_jammer_bright.png"],
    colors: ["#000000", "#374151"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    level: "Recreation"
  },
  {
    id: "womens-swim-rec-1",
    name: "Classic U-Back Float",
    category: "Womens",
    price: 55.00,
    image: "/product_kneeskin_bright.png", // reusing
    images: ["/product_kneeskin_bright.png"],
    colors: ["#000000", "#2563eb", "#ec4899"],
    sizes: ["32", "34", "36", "38", "40"],
    level: "Recreation"
  },
  {
    id: "acc-gog-rec-1",
    name: "ClearSight Basics",
    category: "Accessories",
    price: 22.00,
    image: "/product_goggles_bright.png", // reusing
    images: ["/product_goggles_bright.png"],
    colors: ["#ffffff", "#000000", "#ec4899", "#3b82f6"],
    sizes: ["One Size"],
    level: "Recreation"
  }
];
