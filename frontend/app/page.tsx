"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { dummyProducts } from "@/lib/dummy-data"; // Import dummy products data
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
      // const res = await fetch("/api/products/featured");
      // const data = await res.json();
      // if (data.success || res || data) setFeaturedProducts(data.products);
       setFeaturedProducts(dummyProducts.slice(0, 4)); // Using dummy data for now
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
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
            }}
            className="transition-transform duration-300 hover:rotate-12 focus:scale-110"
            aria-label="Toggle theme"
          >
            <span className="sr-only">Toggle theme</span>
            <span className="inline-block transition-transform duration-300">
              {theme === "dark" ? (
                <Sun size={20} className="animate-spin-slow" />
              ) : (
                <Moon size={20} className="animate-spin-slow" />
              )}
            </span>
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 via-primary/10 to-transparent py-24 mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="container mx-auto px-4 text-center relative">
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-fade-in-easy">
              Fresh Groceries
              <span
                className="block text-foreground mt-2 animate-fade-in-easy"
                style={{
                  animationDelay: "0.2s",
                  animationFillMode: "both",
                }}
              >
                Delivered Fast
              </span>
            </h1>
            <p
              className="text-xl text-muted-foreground/90 mx-auto max-w-2xl leading-relaxed animate-fade-in-easy"
              style={{
                animationDelay: "0.4s",
                animationFillMode: "both",
              }}
            >
              Experience premium quality groceries delivered to your doorstep.
              Fresh produce, artisanal goods, and everyday essentials curated
              just for you.
            </p>

            <form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto animate-fade-in-easy"
              style={{
                animationDelay: "0.6s",
                animationFillMode: "both",
              }}
            >
              <div className="relative group">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-20 py-6 text-lg bg-background/50 backdrop-blur-sm border-primary/20 group-hover:border-primary/40 transition-colors"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90"
                >
                  Search
                </Button>
              </div>
            </form>

            <div
              className="pt-4 animate-fade-in-easy"
              style={{
                animationDelay: "0.8s",
                animationFillMode: "both",
              }}
            >
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                asChild
              >
                <Link href="/products">
                  Browse All Products
                  <span className="ml-2">→</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 py-6">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        {isLoading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50"
              >
                <CardHeader className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-muted/10">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.discount > 0 && (
                      <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
                        {product.discount}% OFF
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-primary">
                        ${product.price}
                      </div>
                      {product.originalPrice > product.price && (
                        <div className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm font-medium">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-primary/90 hover:bg-primary transition-colors"
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
