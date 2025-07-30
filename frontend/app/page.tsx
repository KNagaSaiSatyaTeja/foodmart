"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Star,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// ✅ Types
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  image: string;
  inStock: boolean;
};

type User = {
  name: string;
  email: string;
};

type CartItem = Product & { quantity: number };

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch("/api/products/featured");
      const data = await res.json();
      if (data.success) setFeaturedProducts(data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    const updatedCart = [...cartItems];
    const existingItem = updatedCart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    toast.success(`${product.name} added to cart!`);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCartItems([]);
    toast.success("Logged out successfully");
  };

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-4 py-3 border-b">
        <Link href="/" className="text-xl font-bold text-primary">
          Food Mart
        </Link>
        <div className="flex gap-4 items-center">
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center border rounded px-2"
          >
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button variant="ghost" type="submit" size="icon">
              <Search size={18} />
            </Button>
          </form>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Link href="/cart" className="relative">
            <ShoppingCart />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 text-xs bg-red-500 text-white px-1 rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Button onClick={handleLogout} variant="ghost" size="sm">
                Logout
              </Button>
              <Link href="/profile" className="ml-2">
                <User size={20} />
              </Link>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
          <Button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Responsive Mobile Search */}
      {isMenuOpen && (
        <form onSubmit={handleSearch} className="p-4 md:hidden">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      )}

      {/* Main Content */}
      <main className="px-4 py-6">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        {isLoading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader className="p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary font-bold">
                      ${product.price}
                    </span>
                    <span className="line-through text-muted-foreground">
                      ${product.originalPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">-{product.discount}%</Badge>
                    <div className="flex items-center text-yellow-500 gap-1">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <Button
                    className="mt-3 w-full"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
