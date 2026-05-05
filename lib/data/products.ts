import { Product } from "@/lib/types/product";

export const products: Product[] = [
  {
    id: "p1",
    name: "Installease Smart Socket Pro",
    slug: "installease-smart-socket-pro",
    description: "Energy monitoring smart socket with Matter support.",
    price: 39,
    salePrice: 29,
    images: ["https://images.unsplash.com/photo-1558089687-f282ffcbc126?q=80&w=1200"],
    rating: 4.7,
    reviewCount: 212,
    badge: "Sale",
    ecosystems: ["alexa", "google", "matter"],
    stock: 42,
    brand: "Installease",
    sku: "IL-SKT-001",
    setupDifficulty: "Beginner",
    category: "Sockets"
  },
  {
    id: "p2",
    name: "Guardian 4K Smart Camera",
    slug: "guardian-4k-smart-camera",
    description: "AI-powered indoor camera with night vision.",
    price: 159,
    images: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=1200"],
    rating: 4.8,
    reviewCount: 89,
    badge: "Best Seller",
    ecosystems: ["alexa", "google", "homekit"],
    stock: 11,
    brand: "Guardian",
    sku: "GD-CAM-004",
    setupDifficulty: "Intermediate",
    category: "Security"
  },
  {
    id: "p3",
    name: "Aura Smart Bulb Pack (4)",
    slug: "aura-smart-bulb-pack-4",
    description: "RGB + warm white dimmable bulbs with scenes.",
    price: 69,
    salePrice: 55,
    images: ["https://images.unsplash.com/photo-1550985543-f1ea8365e240?q=80&w=1200"],
    rating: 4.5,
    reviewCount: 301,
    badge: "New",
    ecosystems: ["alexa", "google", "matter"],
    stock: 87,
    brand: "Aura",
    sku: "AU-BLB-410",
    setupDifficulty: "Beginner",
    category: "Lighting"
  }
];
