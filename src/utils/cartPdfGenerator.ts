import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CartItem {
  id: string;
  productId: string;
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
  image?: string;
  quantity: number;
  selectedVariants: {
    size?: string;
    color?: string;
    shape?: string;
    type?: string;
  };
  addedAt: Date;
}

interface CartPDFOptions {
  items: CartItem[];
  total: number;
  date: string;
}

// Helper function to get display price
const getDisplayPrice = (item: CartItem): number => {
  if (item.isSpecialPriceActive && item.specialPrice) {
    return item.specialPrice;
  }
  return item.price || item.mrp || 0;
};

// Helper function to get variant string
const getVariantString = (variants: CartItem['selectedVariants']): string => {
  const variantArray = Object.entries(variants)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}: ${value}`);
  
  return variantArray.length > 0 ? variantArray.join(', ') : '';
};

// Helper function to load image and convert to base64
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

export const generateCartPDF = async (options: CartPDFOptions): Promise<void> => {
  const { items, total, date } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  let yPosition = 40;

  // Header with LUMIZO Logo
  try {
    const logoImageData = await loadImageAsBase64('/src/assets/logo.png');
    // Calculate dimensions to maintain aspect ratio
    const maxWidth = 200;
    const maxHeight = 80;
    const aspectRatio = logoImageData.width / logoImageData.height;
    
    let imageWidth = maxWidth;
    let imageHeight = maxWidth / aspectRatio;
    
    if (imageHeight > maxHeight) {
      imageHeight = maxHeight;
      imageWidth = maxHeight * aspectRatio;
    }
    
    doc.addImage(logoImageData.dataURL, 'PNG', 40, yPosition, imageWidth, imageHeight);
    yPosition += imageHeight + 20;
  } catch (error) {
    console.warn('Failed to load logo image:', error);
    // Fallback to text header
    doc.setFontSize(20);
    doc.setTextColor(83, 86, 90); // #53565A
    doc.setFont(undefined, 'bold');
    doc.text('LUMIZO', 40, yPosition);
    yPosition += 25;
  }

  doc.setFontSize(14);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(255, 158, 27); // #FF9E1B
  doc.text('Sales Quotation', 40, yPosition);
  yPosition += 30;

  // Quote Information
  doc.setFontSize(12);
  doc.setTextColor(83, 86, 90);
  doc.text(`Date: ${date}`, 40, yPosition);
  yPosition += 30;

  // Prepare table data
  const tableData: any[][] = [];
  const productImagesData: Array<{ dataURL: string; width: number; height: number } | null> = [];

  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    const unitPrice = getDisplayPrice(item);
    const itemTotal = unitPrice * item.quantity;
    const variantString = getVariantString(item.selectedVariants);
    
    // Load product image
    let productImageData: { dataURL: string; width: number; height: number } | null = null;
    if (item.image && item.image !== '/placeholder-product.jpg') {
      try {
        productImageData = await loadImageAsBase64(item.image);
      } catch (error) {
        console.warn('Failed to load product image:', error);
        productImageData = null;
      }
    }
    productImagesData.push(productImageData);
    
    let productName = item.name;
    if (item.modelCode) {
      productName += `\n(${item.modelCode})`;
    }
    if (variantString) {
      productName += `\n${variantString}`;
    }

    const row = [
      '', // Image placeholder
      productName,
      item.brand?.name || 'N/A',
      item.quantity,
      `Rs. ${unitPrice.toLocaleString()}`,
      `Rs. ${itemTotal.toLocaleString()}`
    ];

    tableData.push(row);
  }

  // Generate table
  autoTable(doc, {
    head: [['Image', 'Product Details', 'Brand', 'Qty', 'Unit Price', 'Total']],
    body: tableData,
    startY: yPosition,
    theme: 'grid',
    headStyles: {
      fillColor: [255, 158, 27], // #FF9E1B
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 11,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 10,
      cellPadding: 6,
      overflow: 'linebreak',
      valign: 'top',
      minCellHeight: 50
    },
    columnStyles: {
      0: { cellWidth: 60, halign: 'center', valign: 'middle' }, // Image
      1: { cellWidth: 200 }, // Product Details
      2: { cellWidth: 80, halign: 'center' }, // Brand
      3: { cellWidth: 40, halign: 'center' }, // Qty
      4: { cellWidth: 70, halign: 'right' }, // Unit Price
      5: { cellWidth: 80, halign: 'right' } // Total
    },
    margin: { left: 40, right: 40 },
    alternateRowStyles: {
      fillColor: [248, 249, 250]
    },
    didDrawCell: (data) => {
      // Draw product images
      if (data.column.index === 0 && data.cell.section === 'body') {
        const productImageData = productImagesData[data.row.index];
        if (productImageData) {
          try {
            const cellWidth = data.cell.width - 8;
            const cellHeight = data.cell.height - 8;
            
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
            
            const drawX = data.cell.x + (cellWidth - drawWidth) / 2 + 4;
            const drawY = data.cell.y + (cellHeight - drawHeight) / 2 + 4;
            
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
    }
  });

  // Get the Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 20;

  // Add summary section
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(83, 86, 90);

  // Total summary box
  const pageWidth = doc.internal.pageSize.width;
  const boxWidth = 200;
  const boxX = pageWidth - boxWidth - 40;
  
  // Background for total
  doc.setFillColor(248, 249, 250);
  doc.rect(boxX, finalY, boxWidth, 60, 'F');
  
  // Border
  doc.setDrawColor(229, 231, 235);
  doc.rect(boxX, finalY, boxWidth, 60, 'S');

  // Total items
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(`Total Items: ${items.reduce((sum, item) => sum + item.quantity, 0)}`, boxX + 10, finalY + 20);

  // Grand total
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(255, 158, 27); // #FF9E1B
  doc.text(`Grand Total: Rs. ${total.toLocaleString()}`, boxX + 10, finalY + 45);

  // Company contact info
  const contactY = doc.internal.pageSize.height - 50;
  doc.setDrawColor(229, 231, 235);
  doc.line(40, contactY - 10, pageWidth - 40, contactY - 10);
  
  doc.setFontSize(10);
  doc.setTextColor(83, 86, 90);
  doc.setFont(undefined, 'bold');
  doc.text('LUMIZO', 40, contactY);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.text('Lumizo Product Portal | Contact: info@lumizo.lk | www.lumizo.lk', 40, contactY + 15);

  // Page number
  doc.setFontSize(8);
  doc.setTextColor(136, 139, 141);
  doc.text(
    `Page 1 of 1`,
    pageWidth - 60,
    doc.internal.pageSize.height - 20
  );
  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    40,
    doc.internal.pageSize.height - 20
  );

  // Generate filename
  const filename = `lumizo-quote-${Date.now().toString().slice(-6)}-${new Date().toISOString().split('T')[0]}.pdf`;

  // Save the PDF
  doc.save(filename);
};
