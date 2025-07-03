import { useEffect, useState } from "react";
import api from "../api";
import { Card, CardContent } from "@/components/ui/card";

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


export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get("/").then(res => setProducts(res.data));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {products.map(product => (
        <Card key={product._id} className="rounded-2xl shadow-md">
          <CardContent className="flex flex-col items-center">
            <img src={product.imageUrl} alt={product.name} className="w-48 h-48 object-cover rounded-xl" />
            <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
            <p className="text-green-600 font-bold">${product.price}</p>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-xs">Brand: {product.brand}</p>
            <p className="text-xs">Category: {product.category}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {product.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-200 px-2 py-0.5 rounded">{tag}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
