import React, { useState } from "react";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "../api";

interface ProductData {
  name: string;
  price: number;
  category: string;
  brand: string;
  tags: string[];
  description: string;
  images: string[];
  specificationFiles: string[];
  warranty?: string;
}

const ProductForm: React.FC = () => {
  const [formData, setFormData] = useState<Omit<ProductData, "images" | "specificationFiles">>({
    name: "",
    price: 0,
    category: "",
    brand: "",
    tags: [],
    description: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [specFiles, setSpecFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [specUrls, setSpecUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [tagInput, setTagInput] = useState("");

  const handleUpload = async () => {
    const imgUrls: string[] = [];
    for (const file of images) {
      const url = await uploadToCloudinary(file, (p) => {
        setUploadProgress((prev) => ({ ...prev, [file.name]: p }));
      });
      imgUrls.push(url);
    }
    setImageUrls(imgUrls);

    const specFileUrls: string[] = [];
    for (const file of specFiles) {
      const url = await uploadToCloudinary(file, (p) => {
        setUploadProgress((prev) => ({ ...prev, [file.name]: p }));
      });
      specFileUrls.push(url);
    }
    setSpecUrls(specFileUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData: ProductData = {
      ...formData,
      images: imageUrls,
      specificationFiles: specUrls,
    };

    await api.post("/products", productData);
    alert("Product created successfully!");
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput("");
    }
  };

  return (
    <form className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Create New Product</h2>

      <Input
        placeholder="Product Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="mb-2"
      />
      <Input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
        className="mb-2"
      />
      <Input
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="mb-2"
      />
      <Input
        placeholder="Brand"
        value={formData.brand}
        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
        className="mb-2"
      />
      
      <div className="flex items-center space-x-2 mb-2">
        <Input
          placeholder="Add Tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
        />
        <Button type="button" onClick={addTag}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {formData.tags.map((tag) => (
          <Badge key={tag} variant="outline">{tag}</Badge>
        ))}
      </div>

      <Textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="mb-2"
      />

      <label className="block mb-2 font-medium">Images</label>
      <Input type="file" multiple onChange={(e) => setImages(Array.from(e.target.files ?? []))} className="mb-2" />

      <label className="block mb-2 font-medium">Specification Files</label>
      <Input type="file" multiple onChange={(e) => setSpecFiles(Array.from(e.target.files ?? []))} className="mb-2" />

      <Button type="button" onClick={handleUpload} className="mb-4">Upload Files</Button>

      <div className="space-y-1 mb-4">
        {Object.entries(uploadProgress).map(([name, progress]) => (
          <div key={name} className="text-sm">
            {name}: {progress}%
          </div>
        ))}
      </div>

      <Button type="submit" disabled={imageUrls.length === 0 && specUrls.length === 0}>
        Create Product
      </Button>
    </form>
  );
};

export default ProductForm;
