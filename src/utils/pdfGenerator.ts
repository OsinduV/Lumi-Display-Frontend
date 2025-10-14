import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Product {
  _id: string;
  name: string;
  modelCode?: string;
  brand?: {
    _id: string;
    name: string;
    image?: string;
  };
  category?: {
    _id: string;
    name: string;
  };
  price?: number;
  mrp?: number;
  specialPrice?: number;
  isSpecialPriceActive: boolean;
  images: string[];
  tags: Array<{
    _id: string;
    name: string;
  }>;
}

interface Brand {
  _id: string;
  name: string;
  image?: string;
}

interface PDFGenerationOptions {
  products: Product[];
  selectedBrand?: Brand;
  searchTerm?: string;
  selectedCategory?: string;
  selectedTag?: string;
  selectedTagName?: string;
  showPrices: boolean;
}

// Helper function to load image and convert to base64 with original dimensions
const loadImageAsBase64 = async (url: string): Promise<{ dataURL: string; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      // Use original dimensions
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      ctx.drawImage(img, 0, 0);
      
      try {
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        resolve({
          dataURL,
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      // Return a placeholder if image fails to load
      resolve({
        dataURL: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NEg0NEgyMFYyMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+',
        width: 64,
        height: 64
      });
    };
    
    // Handle local images and external URLs
    if (url.startsWith('/') || url.startsWith('./')) {
      img.src = window.location.origin + url;
    } else {
      img.src = url;
    }
  });
};

// Helper function to get display price
const getDisplayPrice = (product: Product): number => {
  if (product.isSpecialPriceActive && product.specialPrice) {
    return product.specialPrice;
  }
  return product.price || product.mrp || 0;
};

// Helper function to get original price
const getOriginalPrice = (product: Product): number | undefined => {
  if (product.isSpecialPriceActive && product.specialPrice && product.price) {
    return product.price;
  }
  return product.mrp;
};

export const generateProductCatalogPDF = async (options: PDFGenerationOptions): Promise<void> => {
  const {
    products,
    selectedBrand,
    searchTerm,
    selectedCategory,
    selectedTag,
    selectedTagName,
    showPrices
  } = options;

  // Use portrait orientation since we have fewer columns now
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });
  let yPosition = 20;

  // Add generation date
  doc.setFontSize(10);
  doc.setTextColor(136, 139, 141); // #888B8D
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`, 14, yPosition);
  yPosition += 10;

  // Add brand header if brand filter is applied
  if (selectedBrand) {
    yPosition += 10;
    
    // Add brand image if available
    if (selectedBrand.image) {
      try {
        const brandImageData = await loadImageAsBase64(selectedBrand.image);
        // Calculate dimensions to maintain aspect ratio while fitting in header
        const maxWidth = 150; // Increased from 30
        const maxHeight = 100; // Increased from 20
        const aspectRatio = brandImageData.width / brandImageData.height;
        
        let imageWidth = maxWidth;
        let imageHeight = maxWidth / aspectRatio;
        
        if (imageHeight > maxHeight) {
          imageHeight = maxHeight;
          imageWidth = maxHeight * aspectRatio;
        }
        
        doc.addImage(brandImageData.dataURL, 'JPEG', 14, yPosition, imageWidth, imageHeight);
      } catch (error) {
        console.warn('Failed to load brand image:', error);
      }
    }
    
    doc.setFontSize(16);
    doc.setTextColor(83, 86, 90);
    doc.text(`- ${selectedBrand.name} Products`, selectedBrand.image ? 190 : 14, yPosition + 20); // Adjusted x position
    yPosition += 50; // Increased space to accommodate larger image
  }

  // Add filter information
  if (searchTerm || selectedCategory || selectedTag) {
    yPosition += 5;
    doc.setFontSize(12);
    doc.setTextColor(83, 86, 90);
    doc.text('Applied Filters:', 14, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.setTextColor(136, 139, 141);
    
    if (searchTerm) {
      doc.text(`• Search: "${searchTerm}"`, 14, yPosition);
      yPosition += 12;
    }
    
    if (selectedCategory) {
      doc.text(`• Category: ${selectedCategory}`, 14, yPosition);
      yPosition += 6;
    }
    
    if (selectedTag && selectedTagName) {
      doc.text(`• Tag: ${selectedTagName}`, 14, yPosition);
      yPosition += 6;
    }
    
    yPosition += 5;
  }

  // Prepare table data with original image dimensions
  const tableHeaders = ['Image', 'Product Name'];
  
  // Add Brand column only if not filtered by brand
  if (!selectedBrand) {
    tableHeaders.push('Brand');
  }
  
  if (showPrices) {
    tableHeaders.push('Price (Rs.)');
  }

  // Group products by category for better organization
  const productsByCategory = products.reduce((acc, product) => {
    const categoryName = product.category?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Calculate available page width for table (portrait mode)
  const pageWidth = doc.internal.pageSize.width; // ~595pt for A4 portrait
  const margins = 28; // 14pt left + 14pt right
  const availableWidth = pageWidth - margins;
  
  // Define column width ratios for portrait (adjusted for removed columns)
  let imageColumnRatio, nameColumnRatio, brandColumnRatio, priceColumnRatio;
  
  if (selectedBrand) {
    // No brand column when filtered by brand
    imageColumnRatio = 0.25; // Increased from 0.2 for larger images
    nameColumnRatio = showPrices ? 0.55 : 0.75; // Adjusted accordingly
    brandColumnRatio = 0; // No brand column
    priceColumnRatio = showPrices ? 0.2 : 0; // 20% for price if shown
  } else {
    // Include brand column when not filtered
    imageColumnRatio = 0.2; // Increased from 0.15 for larger images
    nameColumnRatio = 0.4;  // Adjusted from 0.45
    brandColumnRatio = 0.25; // 25% for brand
    priceColumnRatio = showPrices ? 0.15 : 0; // 15% for price if shown
  }
  
  // Calculate actual column widths
  const imageColumnWidth = availableWidth * imageColumnRatio;
  const nameColumnWidth = availableWidth * nameColumnRatio;
  const brandColumnWidth = selectedBrand ? 0 : availableWidth * brandColumnRatio;
  const priceColumnWidth = showPrices ? availableWidth * priceColumnRatio : 0;

  // Process products by category and generate tables with category headers
  let currentY = yPosition;
  
  for (const [categoryName, categoryProducts] of Object.entries(productsByCategory)) {
    // Add category header
    doc.setFontSize(14);
    doc.setTextColor(0, 103, 160); // #0067A0
    doc.setFont(undefined, 'bold');
    doc.text(`${categoryName}`, 14, currentY += 12);
    doc.setFont(undefined, 'normal');
    currentY += 10; // Reduced from 20 to decrease space
    
    // Prepare table data for this category
    const categoryTableData: any[][] = [];
    const categoryImagesData: Array<{ dataURL: string; width: number; height: number } | null> = [];
    
    for (const product of categoryProducts) {
      const row: any[] = [];
      
      // Add product image
      let productImageData: { dataURL: string; width: number; height: number } | null = null;
      if (product.images && product.images.length > 0 && product.images[0] !== '/placeholder-product.jpg') {
        try {
          productImageData = await loadImageAsBase64(product.images[0]);
        } catch (error) {
          console.warn('Failed to load product image:', error);
          productImageData = null;
        }
      }
      
      categoryImagesData.push(productImageData);
      
      row.push({
        content: '',
        styles: { cellWidth: imageColumnWidth },
        imageData: productImageData
      });
      
      // Product name and model
      let productInfo = product.name;
      if (product.modelCode) {
        productInfo += `\nModel: ${product.modelCode}`;
      }
      row.push(productInfo);
      
      // Add Brand column only if not filtered by brand
      if (!selectedBrand) {
        row.push(product.brand?.name || 'No Brand');
      }
      
      // Price (if showing prices)
      if (showPrices) {
        const displayPrice = getDisplayPrice(product);
        const originalPrice = getOriginalPrice(product);
        let priceText = `Rs. ${displayPrice.toLocaleString()}`;
        
        if (product.isSpecialPriceActive && originalPrice && originalPrice > displayPrice) {
          priceText += `\n(Was: Rs. ${originalPrice.toLocaleString()})`;
        }
        
        row.push(priceText);
      }
      
      categoryTableData.push(row);
    }

    // Generate table for this category
    autoTable(doc, {
      head: [tableHeaders],
      body: categoryTableData,
      startY: currentY,
      theme: 'grid',
      tableWidth: 'wrap',
      headStyles: {
        fillColor: [255, 158, 27], // #FF9E1B
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11 // Increased from 10
      },
      bodyStyles: {
        fontSize: 10, // Increased from 9
        cellPadding: 4, // Increased from 3
        minCellHeight: 50, // Increased from 40 for better image display
        overflow: 'linebreak'
      },
      columnStyles: selectedBrand ? {
        // When filtered by brand (no brand column)
        0: { 
          cellWidth: imageColumnWidth, 
          halign: 'center',
          valign: 'middle'
        },
        1: { 
          cellWidth: nameColumnWidth,
          overflow: 'linebreak'
        },
        ...(showPrices ? { 
          2: { 
            cellWidth: priceColumnWidth, 
            halign: 'right',
            overflow: 'linebreak'
          } 
        } : {})
      } : {
        // When not filtered by brand (include brand column)
        0: { 
          cellWidth: imageColumnWidth, 
          halign: 'center',
          valign: 'middle'
        },
        1: { 
          cellWidth: nameColumnWidth,
          overflow: 'linebreak'
        },
        2: { 
          cellWidth: brandColumnWidth,
          overflow: 'linebreak'
        },
        ...(showPrices ? { 
          3: { 
            cellWidth: priceColumnWidth, 
            halign: 'right',
            overflow: 'linebreak'
          } 
        } : {})
      },
      didDrawCell: (data) => {
        // Draw product images with original proportions
        if (data.column.index === 0 && data.cell.section === 'body') {
          const productImageData = categoryImagesData[data.row.index];
          if (productImageData) {
            try {
              const cellWidth = data.cell.width - 4;
              const cellHeight = data.cell.height - 4;
              
              const imageAspectRatio = productImageData.width / productImageData.height;
              const cellAspectRatio = cellWidth / cellHeight;
              
              let drawWidth, drawHeight;
              
              if (imageAspectRatio > cellAspectRatio) {
                drawWidth = cellWidth;
                drawHeight = cellWidth / imageAspectRatio;
              } else {
                drawHeight = cellHeight;
                drawWidth = cellHeight * imageAspectRatio;
              }
              
              const drawX = data.cell.x + (cellWidth - drawWidth) / 2 + 2;
              const drawY = data.cell.y + (cellHeight - drawHeight) / 2 + 2;
              
              doc.addImage(
                productImageData.dataURL,
                'JPEG',
                drawX,
                drawY,
                drawWidth,
                drawHeight
              );
            } catch (error) {
              console.warn('Failed to add image to PDF:', error);
            }
          }
        }
      },
      margin: { left: 14, right: 14, top: 10, bottom: 10 },
      pageBreak: 'auto',
      rowPageBreak: 'avoid'
    });
    
    // Update current Y position for next category
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // Add footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(136, 139, 141);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      'Generated by Lumizo Product Portal',
      14,
      doc.internal.pageSize.height - 10
    );
  }

  // Generate filename
  let filename = 'product-catalog';
  if (selectedBrand) {
    filename += `-${selectedBrand.name.toLowerCase().replace(/\s+/g, '-')}`;
  }
  if (searchTerm) {
    filename += `-search-${searchTerm.toLowerCase().replace(/\s+/g, '-')}`;
  }
  filename += '-' + new Date().toISOString().split('T')[0];
  filename += '.pdf';

  // Save the PDF
  doc.save(filename);
};
