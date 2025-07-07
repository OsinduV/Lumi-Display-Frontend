import React, { useEffect, useState } from "react";
import api from "../api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

interface Product {
  _id?: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  tags: string[];
  description?: string;
  warranty?: string;
}

const emptyProduct: Product = {
  name: "",
  price: 0,
  images: [],
  category: "",
  brand: "",
  tags: [],
  description: "",
  warranty: "",
};

const AdminProductManage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [formProduct, setFormProduct] = useState<Product>(emptyProduct);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products", {
        params: { name: searchKeyword || undefined },
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchKeyword]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product", error);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setFormProduct({ ...product }); // Pre-fill form
    setIsEditing(true);
  };

  const handleFormChange = (
    field: keyof Product,
    value: string | number | string[]
  ) => {
    setFormProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && formProduct._id) {
        await api.put(`/products/${formProduct._id}`, formProduct);
        alert("Product updated successfully");
      } else {
        await api.post("/products", formProduct);
        alert("Product created successfully");
      }
      setFormProduct(emptyProduct);
      setIsEditing(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Product list */}
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="mb-2"
        />
        <div className="overflow-x-auto rounded border">
          <Table className="min-w-full text-sm">
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(5)].map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : products.map((product) => (
                    <TableRow key={product._id} className="hover:bg-muted/20">
                      <TableCell>
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded shadow"
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>Rs. {product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product._id!)}
                          className="ml-2"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Form */}
      <div className="w-full md:w-96 border rounded p-4 space-y-3 bg-muted/20">
        <h2 className="text-xl font-semibold">
          {isEditing ? "Edit Product" : "Create New Product"}
        </h2>

        <Input
          placeholder="Name"
          value={formProduct.name}
          onChange={(e) => handleFormChange("name", e.target.value)}
        />
        <Input
          type="number"
          placeholder="Price"
          value={formProduct.price}
          onChange={(e) => handleFormChange("price", parseFloat(e.target.value))}
        />
        <Input
          placeholder="Category"
          value={formProduct.category}
          onChange={(e) => handleFormChange("category", e.target.value)}
        />
        <Input
          placeholder="Brand"
          value={formProduct.brand}
          onChange={(e) => handleFormChange("brand", e.target.value)}
        />
        <Input
          placeholder="Warranty (e.g., 2 years)"
          value={formProduct.warranty || ""}
          onChange={(e) => handleFormChange("warranty", e.target.value)}
        />
        <Textarea
          placeholder="Description"
          value={formProduct.description || ""}
          onChange={(e) => handleFormChange("description", e.target.value)}
        />
        <Input
          placeholder="Image URLs (comma separated)"
          value={formProduct.images.join(",")}
          onChange={(e) =>
            handleFormChange("images", e.target.value.split(",").map((v) => v.trim()))
          }
        />
        <Input
          placeholder="Tags (comma separated)"
          value={formProduct.tags.join(",")}
          onChange={(e) =>
            handleFormChange("tags", e.target.value.split(",").map((v) => v.trim()))
          }
        />
        <Button onClick={handleSubmit}>
          {isEditing ? "Update Product" : "Create Product"}
        </Button>
        {isEditing && (
          <Button
            variant="outline"
            onClick={() => {
              setFormProduct(emptyProduct);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminProductManage;
