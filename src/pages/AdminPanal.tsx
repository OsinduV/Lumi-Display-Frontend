import { useEffect, useState } from "react";
import api from "../api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await api.get("/");
    setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files[0]) {
      const file = files[0];
      setForm(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
    setImagePreview(null);
    await fetchProducts();
    setLoading(false);
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
    setImagePreview(product.imageUrl ?? null);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await api.delete(`/${id}`);
    await fetchProducts();
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editingId ? "Update Product" : "Add New Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} />
            <Input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
            <Textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <Input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
            <Input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} />
            <Input name="tags" placeholder="Tags (comma-separated)" value={form.tags} onChange={handleChange} />
            <Input name="image" type="file" onChange={handleChange} />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-md border w-32 h-32 object-cover mt-2"
              />
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              {editingId ? "Update Product" : "Add Product"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <h3 className="text-lg font-semibold mb-4">Products</h3>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {products.map(p => (
            <Card key={p._id} className="shadow-sm">
              <CardContent className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-12 h-12 rounded object-cover border"
                    />
                  )}
                  <div>
                    <p className="font-medium text-primary">{p.name}</p>
                    <p className="text-muted-foreground text-sm">${p.price}</p>
                    <p className="text-sm">{p.category} | {p.brand}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(p._id!)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
