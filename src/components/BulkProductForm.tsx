import React, { useState } from "react";
import api from "../api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { uploadToCloudinary } from "../utils/cloudinaryUpload"; // You already have this

interface ProductRow {
  name: string;
  price: number;
  category: string;
  brand: string;
  tags: string;
  description: string;
  warranty: string; // ✅ Added
  imageUrl: string;
  specFileUrl: string;
  uploadProgress: number;
}

const emptyRow: ProductRow = {
  name: "",
  price: 0,
  category: "",
  brand: "",
  tags: "",
  description: "",
  warranty: "",
  imageUrl: "",
  specFileUrl: "",
  uploadProgress: 0,
};

const BulkTableProductForm: React.FC = () => {
  const [rows, setRows] = useState<ProductRow[]>([{ ...emptyRow }]);

  const handleChange = (index: number, field: keyof ProductRow, value: string | number) => {
    const updatedRows = [...rows];
    (updatedRows[index][field] as typeof value) = value;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { ...emptyRow }]);
  };

  const removeRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleImageUpload = async (file: File, index: number) => {
    const url = await uploadToCloudinary(file, (p) => {
      const updated = [...rows];
      updated[index].uploadProgress = p;
      setRows(updated);
    });
    const updated = [...rows];
    updated[index].imageUrl = url;
    setRows(updated);
  };

  const handleSpecFileUpload = async (file: File, index: number) => {
    const url = await uploadToCloudinary(file, (p) => {
      const updated = [...rows];
      updated[index].uploadProgress = p;
      setRows(updated);
    }, "raw");
    const updated = [...rows];
    updated[index].specFileUrl = url;
    setRows(updated);
  };

  const handleSubmit = async () => {
    const preparedProducts = rows.map(row => ({
      name: row.name,
      price: row.price,
      category: row.category,
      brand: row.brand,
      tags: row.tags.split(",").map(tag => tag.trim()),
      description: row.description,
      warranty: row.warranty, // ✅ Include warranty
      images: row.imageUrl ? [row.imageUrl] : [],
      specificationFiles: row.specFileUrl ? [row.specFileUrl] : [],
    }));

    await api.post("/products/bulk", { products: preparedProducts });
    alert("Products created successfully!");
    setRows([{ ...emptyRow }]);
  };

  return (
    <div className="overflow-x-auto bg-white shadow rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">Bulk Create Products (Table with Uploads)</h2>

      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Brand</th>
            <th className="p-2 border">Tags</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Warranty</th> {/* ✅ Added */}
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Spec File</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b">
              <td className="p-2 border">
                <Input
                  value={row.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                />
              </td>
              <td className="p-2 border">
                <Input
                  type="number"
                  value={row.price}
                  onChange={(e) => handleChange(index, "price", parseFloat(e.target.value))}
                />
              </td>
              <td className="p-2 border">
                <Input
                  value={row.category}
                  onChange={(e) => handleChange(index, "category", e.target.value)}
                />
              </td>
              <td className="p-2 border">
                <Input
                  value={row.brand}
                  onChange={(e) => handleChange(index, "brand", e.target.value)}
                />
              </td>
              <td className="p-2 border">
                <Input
                  value={row.tags}
                  onChange={(e) => handleChange(index, "tags", e.target.value)}
                />
              </td>
              <td className="p-2 border">
                <Textarea
                  value={row.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                  className="min-h-[60px]"
                />
              </td>
              <td className="p-2 border">
                <Input
                  value={row.warranty}
                  onChange={(e) => handleChange(index, "warranty", e.target.value)}
                  placeholder="e.g., 2 years"
                />
              </td>
              <td className="p-2 border">
                <Input
                  type="file"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], index)}
                />
                {row.imageUrl && (
                  <img
                    src={row.imageUrl}
                    alt="Uploaded"
                    className="mt-1 w-14 h-14 object-cover rounded"
                  />
                )}
              </td>
              <td className="p-2 border">
                <Input
                  type="file"
                  onChange={(e) => e.target.files && handleSpecFileUpload(e.target.files[0], index)}
                />
                {row.specFileUrl && (
                  <a href={row.specFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs">
                    View Spec
                  </a>
                )}
              </td>
              <td className="p-2 border text-center">
                {rows.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeRow(index)}
                  >
                    Remove
                  </Button>
                )}
                {row.uploadProgress > 0 && row.uploadProgress < 100 && (
                  <div className="text-xs mt-1">{row.uploadProgress}%</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-3 mt-4">
        <Button type="button" variant="outline" onClick={addRow}>
          Add Row
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Submit All
        </Button>
      </div>
    </div>
  );
};

export default BulkTableProductForm;
