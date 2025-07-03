import { useEffect, useState } from "react";
import api from "../api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export interface Product {
  _id?: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category: string;
  brand: string;
  tags: string[];
}


export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Omit<Partial<Product>, "tags"> & { tags: string; image?: File | null }>({
    name: "",
    price: 0,
    description: "",
    category: "",
    brand: "",
    tags: "",
    image: null,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProducts = () => {
    api.get("/").then(res => setProducts(res.data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setForm(prev => ({ ...prev, image: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "tags") {
          data.append("tags", value as string);
        } else {
          data.append(key, value as any);
        }
      }
    });

    if (editingId) {
      await api.put(`/${editingId}`, data);
      setEditingId(null);
    } else {
      await api.post("/", data);
    }

    setForm({ name: "", price: 0, description: "", category: "", brand: "", tags: "", image: null });
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product._id!);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      brand: product.brand,
      tags: product.tags.join(","),
      image: null,
    });
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/${id}`);
    fetchProducts();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <form onSubmit={handleSubmit} className="space-y-2 bg-gray-50 p-4 rounded-xl shadow">
        <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <Input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
        <Textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <Input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <Input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} />
        <Input name="tags" placeholder="Tags (comma-separated)" value={form.tags} onChange={handleChange} />
        <Input name="image" type="file" onChange={handleChange} />
        <Button type="submit" className="w-full">{editingId ? "Update Product" : "Add Product"}</Button>
      </form>

      <div className="mt-6 space-y-2">
        {products.map(p => (
          <div key={p._id} className="flex justify-between bg-white p-2 rounded shadow">
            <span>{p.name} - ${p.price}</span>
            <div className="space-x-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(p._id!)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
