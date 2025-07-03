import { useEffect, useState } from "react";
import api from "../api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Product {
  _id?: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  category?: string;
  brand?: string;
  tags?: string[];
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.get("/")
      .then(res => {
        setProducts(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const skeletonArray = Array.from({ length: 8 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {loading
        ? skeletonArray.map((_, index) => (
            <Card
              key={index}
              className="rounded-2xl shadow-md animate-pulse flex flex-col"
            >
              <div className="w-full h-52 bg-gray-300 rounded-xl mb-4"></div>
              <CardContent className="flex flex-col flex-1 p-2">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))
        : products.map(product => (
            <Card
              key={product._id}
              className="rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <CardContent className="flex flex-col flex-1 text-center p-2">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-52 object-cover rounded-xl mb-4 hover:scale-105 transition-transform duration-300"
                />
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-green-600 text-lg font-semibold mb-2">Rs. {product.price}</p>

                {product.tags && product.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap justify-center gap-1">
                    {product.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5 rounded">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {(product.brand || product.category) && (
                  <div className="mt-3 flex flex-col items-center text-xs text-muted-foreground">
                    {product.brand && (
                      <p>
                        Brand: <span className="font-medium">{product.brand}</span>
                      </p>
                    )}
                    {product.category && (
                      <p>
                        Category: <span className="font-medium">{product.category}</span>
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
    </div>
  );
}
