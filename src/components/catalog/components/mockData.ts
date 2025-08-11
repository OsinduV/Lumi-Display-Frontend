import type { Product, Category, Brand } from './types';

export const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'LED Panel Light 600x600',
    modelCode: 'LP-600-40W',
    brand: { _id: 'b1', name: 'LUMIZO' },
    category: { _id: 'c1a', name: 'LED Panels' },
    price: 4500,
    mrp: 5000,
    specialPrice: 4200,
    isSpecialPriceActive: true,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'],
    tags: [
      { _id: 't1', name: 'Energy Efficient' },
      { _id: 't2', name: 'Dimmable' }
    ]
  },
  {
    _id: '2',
    name: 'Smart LED Bulb 9W',
    modelCode: 'SLB-9W-RGB',
    brand: { _id: 'b2', name: 'Philips', image: '/brand-logos/philips.jpg' },
    category: { _id: 'c1b', name: 'LED Bulbs' },
    price: 1800,
    mrp: 2200,
    specialPrice: 1600,
    isSpecialPriceActive: false,
    images: ['https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop'],
    tags: [
      { _id: 't3', name: 'Smart' },
      { _id: 't1', name: 'Energy Efficient' }
    ]
  },
  {
    _id: '3',
    name: 'Track Light 30W COB',
    modelCode: 'TL-30W-COB',
    brand: { _id: 'b3', name: 'OSRAM', image: '/brand-logos/osram.png' },
    category: { _id: 'c3a', name: 'Track Lights' },
    price: 3200,
    mrp: 3800,
    specialPrice: 2900,
    isSpecialPriceActive: true,
    images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=300&fit=crop'],
    tags: [
      { _id: 't4', name: 'Commercial' },
      { _id: 't5', name: 'High Output' }
    ]
  },
  {
    _id: '4',
    name: 'Pendant Light Modern',
    modelCode: 'PL-MOD-15W',
    brand: { _id: 'b1', name: 'LUMIZO' },
    category: { _id: 'c4', name: 'Residential Lighting' },
    price: 2800,
    mrp: 3200,
    specialPrice: 2500,
    isSpecialPriceActive: false,
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'],
    tags: [
      { _id: 't6', name: 'Decorative' },
      { _id: 't7', name: 'Modern' }
    ]
  },
  {
    _id: '5',
    name: 'Outdoor Flood Light 50W',
    modelCode: 'FL-50W-IP65',
    brand: { _id: 'b4', name: 'LEDVANCE', image: '/brand-logos/ledvance.png' },
    category: { _id: 'c5', name: 'Outdoor Lighting' },
    price: 5200,
    mrp: 6000,
    specialPrice: 4800,
    isSpecialPriceActive: true,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'],
    tags: [
      { _id: 't8', name: 'Outdoor' },
      { _id: 't9', name: 'Waterproof' }
    ]
  },
  {
    _id: '6',
    name: 'LED Strip Light 5M',
    modelCode: 'LS-5M-RGB',
    brand: { _id: 'b2', name: 'Philips' },
    category: { _id: 'c6', name: 'Decorative Lighting' },
    price: 2100,
    mrp: 2500,
    specialPrice: 1950,
    isSpecialPriceActive: true,
    images: ['https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop'],
    tags: [
      { _id: 't10', name: 'RGB' },
      { _id: 't11', name: 'Flexible' }
    ]
  },
  {
    _id: '7',
    name: 'Ceiling Fan Light 48W',
    modelCode: 'CFL-48W-WW',
    brand: { _id: 'b1', name: 'LUMIZO' },
    category: { _id: 'c4', name: 'Residential Lighting' },
    price: 3800,
    mrp: 4200,
    specialPrice: 3500,
    isSpecialPriceActive: false,
    images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=300&fit=crop'],
    tags: [
      { _id: 't12', name: 'Warm White' },
      { _id: 't13', name: 'Remote Control' }
    ]
  },
  {
    _id: '8',
    name: 'Industrial High Bay 100W',
    modelCode: 'IHB-100W-CW',
    brand: { _id: 'b3', name: 'OSRAM' },
    category: { _id: 'c3b', name: 'High Bay Lights' },
    price: 7200,
    mrp: 8000,
    specialPrice: 6800,
    isSpecialPriceActive: true,
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'],
    tags: [
      { _id: 't14', name: 'Industrial' },
      { _id: 't15', name: 'High Power' }
    ]
  }
];

export const mockCategories: Category[] = [
  { _id: 'c1', name: 'LED Lighting', level: 0, subcategories: [
    { _id: 'c1a', name: 'LED Panels', level: 1, parent: { _id: 'c1', name: 'LED Lighting' } },
    { _id: 'c1b', name: 'LED Bulbs', level: 1, parent: { _id: 'c1', name: 'LED Lighting' } }
  ]},
  { _id: 'c2', name: 'Smart Lighting', level: 0 },
  { _id: 'c3', name: 'Commercial Lighting', level: 0, subcategories: [
    { _id: 'c3a', name: 'Track Lights', level: 1, parent: { _id: 'c3', name: 'Commercial Lighting' } },
    { _id: 'c3b', name: 'High Bay Lights', level: 1, parent: { _id: 'c3', name: 'Commercial Lighting' } }
  ]},
  { _id: 'c4', name: 'Residential Lighting', level: 0 },
  { _id: 'c5', name: 'Outdoor Lighting', level: 0 },
  { _id: 'c6', name: 'Decorative Lighting', level: 0 }
];

export const mockBrands: Brand[] = [
  { _id: 'b1', name: 'LUMIZO', image: '/brand-logos/lumizo.png' },
  { _id: 'b2', name: 'Philips', image: '/brand-logos/philips.jpg' },
  { _id: 'b3', name: 'OSRAM', image: '/brand-logos/osram.png' },
  { _id: 'b4', name: 'LEDVANCE', image: '/brand-logos/ledvance.png' }
];
