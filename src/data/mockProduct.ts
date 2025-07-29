// Mock product data for testing ProductDetailModal
export const mockProduct = {
  _id: "product_001",
  name: "Philips LED Panel Light 60x60cm",
  modelCode: "PL-6060-40W-4000K",
  description: "High-efficiency LED panel light designed for office and commercial spaces. Features uniform light distribution, long lifespan, and energy-saving technology. Perfect for suspended ceilings and modern interior designs.",
  features: [
    "High luminous efficacy of 120 lm/W",
    "50,000 hours lifespan",
    "Flicker-free operation",
    "Instant start-up",
    "Wide beam angle of 120°",
    "Mercury-free and UV-free",
    "Compatible with standard ceiling grids",
    "Low heat generation",
    "Uniform light distribution across the panel"
  ],
  brand: {
    _id: "brand_philips",
    name: "Philips",
    image: "/brand-logos/philips.jpg"
  },
  category: {
    _id: "category_panels",
    name: "LED Panels"
  },
  price: 4500,
  mrp: 5500,
  specialPrice: 3800,
  isSpecialPriceActive: true,
  images: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1573167243872-43c6433b9d40?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=600&fit=crop"
  ],
  specSheets: [
    "https://www.philips.com/content/dam/b2b-li/en_AA/products/led-panels/CoreLine_Panel_datasheet.pdf",
    "https://www.philips.com/content/dam/b2b-li/en_AA/products/led-panels/installation_guide.pdf"
  ],
  tags: [
    { _id: "tag_energy_efficient", name: "Energy Efficient" },
    { _id: "tag_commercial", name: "Commercial" },
    { _id: "tag_office", name: "Office Lighting" },
    { _id: "tag_ceiling_mount", name: "Ceiling Mount" },
    { _id: "tag_long_life", name: "Long Life" }
  ],
  sizes: ["60x60cm", "30x120cm", "60x120cm"],
  colors: ["Cool White (4000K)", "Warm White (3000K)", "Daylight (6500K)"],
  shapes: ["Square", "Rectangular"],
  redistributionPrice: 3200
};

export const mockBrands = [
  {
    _id: "brand_philips",
    name: "Philips",
    image: "/brand-logos/philips.jpg"
  },
  {
    _id: "brand_osram",
    name: "OSRAM",
    image: "/brand-logos/osram.png"
  },
  {
    _id: "brand_ledvance",
    name: "LEDVANCE",
    image: "/brand-logos/ledvance.png"
  }
];

// Example usage in your component:
/*
import { mockProduct, mockBrands } from '@/data/mockProduct';

// In your component state
const [selectedProduct, setSelectedProduct] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

// To test the modal
const handleTestModal = () => {
  setSelectedProduct(mockProduct);
  setIsModalOpen(true);
};

// In your JSX
<ProductDetailModal
  product={selectedProduct}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  brands={mockBrands}
/>
*/
