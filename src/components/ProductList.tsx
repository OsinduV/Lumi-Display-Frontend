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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconLayoutColumns, IconChevronDown } from "@tabler/icons-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  tags: string[];
  specificationFiles?: string[];
  warranty?: string;
}

const brandLogos: Record<string, string> = {
  PHILIPS: "/brand-logos/philips.jpg",
  OSRAM: "/brand-logos/osram.png",
  LEDVANCE: "/brand-logos/ledvance.png",
  DECOLIGHT: "/brand-logos/decolight.png",
  EGLO: "/brand-logos/eglo.png",
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    name: true,
    price: true,
    category: false,
    brand: true,
    warranty: true,
    tags: false,
    specSheet: true,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products", {
        params: {
          name: searchKeyword || undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          brand: selectedBrand !== "all" ? selectedBrand : undefined,
        },
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
  }, [searchKeyword, selectedCategory, selectedBrand]);

  // Control brand column visibility dynamically
  useEffect(() => {
    setColumnVisibility((prev) => ({
      ...prev,
      brand: selectedBrand === "all",
    }));
  }, [selectedBrand]);

  const handleImageClick = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  return (
    <div className="px-6 py-6 space-y-6">
      <div className="text-center md:text-left space-y-1">
  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800">
    Explore Our Product Collection
  </h1>
  <p className="text-gray-500 text-base md:text-lg">
    Discover high-quality products for every need.
  </p>
</div>

      <div className="flex flex-col md:flex-row items-center gap-4 border p-4 rounded-lg bg-muted/20">
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full md:max-w-md"
        />

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Clothing">Clothing</SelectItem>
            <SelectItem value="Furniture">Furniture</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            <SelectItem value="PHILIPS">PHILIPS</SelectItem>
            <SelectItem value="OSRAM">OSRAM</SelectItem>
            <SelectItem value="LEDVANCE">LEDVANCE</SelectItem>
            <SelectItem value="DECOLIGHT">DECOLIGHT</SelectItem>
            <SelectItem value="EGLO">EGLO</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger className="w-full md:w-auto">
            <span className="inline-flex items-center justify-center cursor-pointer rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted">
              <IconLayoutColumns className="mr-1 h-4 w-4" /> Columns
              <IconChevronDown className="ml-1 h-4 w-4" />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {[
              { key: "name", label: "Name" },
              { key: "price", label: "Price" },
              { key: "category", label: "Category" },
              { key: "tags", label: "Tags" },
              { key: "specSheet", label: "Spec Sheet" },
              { key: "warranty", label: "Warranty" },
            ].map((col) => (
              <DropdownMenuCheckboxItem
                key={col.key}
                checked={columnVisibility[col.key] !== false}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    [col.key]: value,
                  }))
                }
              >
                {col.label}
              </DropdownMenuCheckboxItem>
            ))}
            {/* Brand column toggle only shown if "All Brands" */}
            {selectedBrand === "all" && (
              <DropdownMenuCheckboxItem
                key="brand"
                checked={columnVisibility.brand !== false}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    brand: value,
                  }))
                }
              >
                Brand
              </DropdownMenuCheckboxItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedBrand !== "all" && (
        <div className="flex justify-center py-4">
          {brandLogos[selectedBrand] ? (
            <img
              src={brandLogos[selectedBrand]}
              alt={selectedBrand}
              className="h-16 w-auto object-contain"
            />
          ) : (
            <h3 className="text-xl font-semibold">{selectedBrand}</h3>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-md border">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Image</TableHead>
              {columnVisibility.name && <TableHead>Name</TableHead>}
              {columnVisibility.price && <TableHead>Price</TableHead>}
              {columnVisibility.category && <TableHead>Category</TableHead>}
              {columnVisibility.brand && <TableHead>Brand</TableHead>}
              {columnVisibility.warranty && <TableHead>Warranty</TableHead>}
              {columnVisibility.tags && <TableHead>Tags</TableHead>}
              {columnVisibility.specSheet && <TableHead>Spec Sheet</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(7)].map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : products.map((product) => (
                  <TableRow key={product._id} className="hover:bg-muted/20">
                    <TableCell>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        onClick={() => handleImageClick(product)}
                        className="w-16 h-16 object-cover rounded shadow-sm cursor-pointer transition-transform hover:scale-105"
                      />
                    </TableCell>
                    {columnVisibility.name && <TableCell>{product.name}</TableCell>}
                    {columnVisibility.price && <TableCell>Rs. {product.price.toFixed(2)}</TableCell>}
                    {columnVisibility.category && <TableCell>{product.category}</TableCell>}
                    {columnVisibility.brand && (
                      <TableCell>
                        {brandLogos[product.brand] ? (
                          <img
                            src={brandLogos[product.brand]}
                            alt={product.brand}
                            className="h-8 w-auto object-contain"
                          />
                        ) : (
                          <span>{product.brand}</span>
                        )}
                      </TableCell>
                    )}
                    {columnVisibility.warranty && (
                      <TableCell>{product.warranty}</TableCell>
                    )}
                    {columnVisibility.tags && (
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.specSheet && (
                      <TableCell>
                        {product.specificationFiles && product.specificationFiles.length > 0 ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(product.specificationFiles[0], "_blank")}
                          >
                            View
                          </Button>
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {!loading && products.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-2">Try changing search or filters.</p>
          </div>
        )}
      </div>

      {/* Dialog for Product Details */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
                <DialogDescription>
                  {selectedProduct.category} —{" "}
                  {brandLogos[selectedProduct.brand] ? (
                    <img
                      src={brandLogos[selectedProduct.brand]}
                      alt={selectedProduct.brand}
                      className="inline-block h-6 ml-1"
                    />
                  ) : (
                    <span>{selectedProduct.brand}</span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-full rounded-md object-cover mb-4"
              />
              <p className="text-gray-700 mb-2">
                Price: <strong>RS. {selectedProduct.price.toFixed(2)}</strong>
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProduct.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              {selectedProduct.specificationFiles && selectedProduct.specificationFiles.length > 0 ? (
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedProduct.specificationFiles?.[0], "_blank")}
                >
                  View Spec Sheet
                </Button>
              ) : (
                <p className="text-gray-400 italic">No spec sheet available.</p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;
