import type { Product, Category } from './types';

// Helper function to flatten hierarchical categories for dropdown display
export const flattenCategories = (categories: Category[]): Category[] => {
  const flattened: Category[] = [];
  
  categories.forEach(category => {
    // Add parent category
    flattened.push({
      ...category,
      name: category.level === 0 ? category.name : `-- ${category.name}` // Indent subcategories
    });
    
    // Add subcategories if they exist
    if (category.subcategories && category.subcategories.length > 0) {
      category.subcategories.forEach(subcategory => {
        flattened.push({
          ...subcategory,
          name: `-- ${subcategory.name}` // Indent subcategories
        });
      });
    }
  });
  
  return flattened;
};

// Helper function to get all category IDs that should match when a category is selected
// (includes the category itself and all its subcategories)
export const getCategoryFilterIds = (categoryId: string, categories: Category[]): string[] => {
  if (!categoryId) return [];
  
  const category = categories.find(c => c._id === categoryId);
  if (!category) return [categoryId];
  
  const ids = [categoryId];
  
  // If this is a parent category, add all subcategory IDs
  if (category.subcategories && category.subcategories.length > 0) {
    category.subcategories.forEach(subcategory => {
      ids.push(subcategory._id);
    });
  }
  
  return ids;
};

// Helper function to get display price for a product
export const getDisplayPrice = (product: Product) => {
  if (product.isSpecialPriceActive && product.specialPrice) {
    return product.specialPrice;
  }
  return product.price || product.mrp || 0;
};
