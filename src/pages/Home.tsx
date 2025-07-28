
import React, { useState, useEffect } from "react";
import { 
  Search, 
  Lightbulb,
  ArrowRight,
  Grid3X3,
  Zap,
  Shield,
  Star,
  Users,
  Building,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { brandAPI } from "@/api";

interface Brand {
  _id: string;
  name: string;
  image?: string;
}

const quickActions = [
  {
    title: 'Product Catalog',
    description: 'Browse our complete lighting collection with pricing',
    icon: <Grid3X3 className="w-6 h-6" />,
    route: '/catalog',
    color: 'from-[#FF9E1B] to-[#FFB84D]',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop'
  },
  {
    title: 'Admin Panel',
    description: 'Manage products, categories and inventory',
    icon: <Shield className="w-6 h-6" />,
    route: '/admin-panel',
    color: 'from-[#0067A0] to-[#4A9EFF]',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop'
  }
];

const features = [
  {
    icon: <Star className="w-8 h-8" />,
    title: "Premium Quality",
    description: "Curated lighting solutions from world-class manufacturers",
    color: "from-[#FF9E1B] to-[#FFB84D]"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Expert Support",
    description: "Professional guidance for all your lighting needs",
    color: "from-[#0067A0] to-[#4A9EFF]"
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Reliable Service",
    description: "Consistent delivery and outstanding customer satisfaction",
    color: "from-[#008C95] to-[#00B4C5]"
  },
  {
    icon: <Building className="w-8 h-8" />,
    title: "Complete Solutions",
    description: "From residential to commercial lighting projects",
    color: "from-[#22C55E] to-[#16A34A]"
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await brandAPI.getAll();
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/catalog');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF9E1B]/20 via-[#0067A0]/20 to-[#008C95]/20 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#FF9E1B]/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#0067A0]/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#008C95]/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#FF9E1B] rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#0067A0] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-[#008C95] rounded-full animate-bounce"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            {/* Logo with glow effect */}
            <div className="flex justify-center mb-8 relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF9E1B] to-[#0067A0] rounded-3xl blur-xl opacity-60 animate-pulse"></div>
                <div className="relative p-6 bg-gradient-to-r from-[#FF9E1B] to-[#0067A0] rounded-3xl shadow-2xl">
                  <Lightbulb className="w-16 h-16 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>

            {/* Main Heading with enhanced typography */}
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Welcome to{' '}
              <div className="relative inline-block">
                <span className="bg-gradient-to-r from-[#FF9E1B] via-[#0067A0] to-[#008C95] bg-clip-text text-transparent animate-gradient-x">
                  Lumizo Portal
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9E1B] via-[#0067A0] to-[#008C95] rounded-full transform scale-x-0 animate-scale-x"></div>
              </div>
            </h1>

            {/* Subtitle with better spacing */}
            <p className="text-xl lg:text-3xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Your comprehensive{' '}
              <span className="font-semibold text-[#0067A0]">lighting showroom portal</span>.{' '}
              <br className="hidden lg:block" />
              Search, showcase, and sell with confidence.
            </p>
            
            {/* Enhanced Search Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-16">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF9E1B] to-[#0067A0] rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-2">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search products, brands, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-16 pr-32 py-6 text-lg rounded-xl border-0 focus:border-0 focus:ring-0 bg-transparent text-gray-800 placeholder-gray-500"
                  />
                  <Button 
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#FF9E1B] to-[#0067A0] hover:from-[#E8890E] hover:to-[#005A8B] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </form>

            {/* Enhanced Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">{feature.title}</h3>
                    <p className="text-gray-600 relative z-10 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access the tools you need to serve customers effectively
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                onClick={() => navigate(action.route)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={action.image} 
                    alt={action.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center text-white`}>
                    {action.icon}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 mb-4">{action.description}</p>
                  <ArrowRight className="w-5 h-5 text-[#0067A0] group-hover:translate-x-1 transition-transform duration-300" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lighting Showcase */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Lighting Solutions in Action
            </h2>
            <p className="text-lg text-gray-300">
              See how our lighting transforms spaces
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Modern Office Lighting',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
                category: 'Commercial'
              },
              {
                title: 'Residential Smart Lighting',
                image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
                category: 'Smart Home'
              },
              {
                title: 'Retail Display Lighting',
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
                category: 'Retail'
              },
              {
                title: 'Architectural Lighting',
                image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&h=400&fit=crop',
                category: 'Architectural'
              },
              {
                title: 'Industrial Lighting',
                image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop',
                category: 'Industrial'
              },
              {
                title: 'Outdoor Lighting',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
                category: 'Outdoor'
              }
            ].map((showcase, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl">
                  <img 
                    src={showcase.image} 
                    alt={showcase.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-[#FF9E1B] text-white mb-2">
                      {showcase.category}
                    </Badge>
                    <h3 className="text-white font-semibold text-lg">{showcase.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Partners */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted Brand Partners
            </h2>
            <p className="text-lg text-gray-600">
              Representing the world's leading lighting manufacturers
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {brands.length > 0 ? (
              brands.map((brand) => (
                <div key={brand._id} className="text-center group cursor-pointer">
                  <div className="w-20 h-20 mx-auto mb-3 bg-white rounded-xl shadow-md flex items-center justify-center group-hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    {brand.image ? (
                      <img 
                        src={brand.image} 
                        alt={brand.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-700 group-hover:text-[#0067A0] transition-colors duration-300">
                        {brand.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{brand.name}</div>
                </div>
              ))
            ) : (
              // Fallback content while loading or if no brands found
              <div className="col-span-full text-center py-8">
                <div className="animate-pulse">
                  <div className="text-gray-500">Loading brand partners...</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 lg:py-16 bg-gradient-to-r from-[#FF9E1B] via-[#0067A0] to-[#008C95]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Zap className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Light Up Your Sales?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Explore our comprehensive catalog and discover the perfect lighting solutions for your customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/catalog')}
              className="bg-white text-[#0067A0] hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Explore Catalog
              <Grid3X3 className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={() => navigate('/admin-panel')}
              variant="outline" 
              className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
            >
              Admin Panel
              <Shield className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
