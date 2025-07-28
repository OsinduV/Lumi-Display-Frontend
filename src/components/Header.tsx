import React, { useState, useEffect } from "react";
import { Menu, User, Search, Lightbulb, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import { tagAPI } from "@/api";

interface Tag {
  _id: string;
  name: string;
}


const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileSearchTerm, setMobileSearchTerm] = useState('');

  // Mock tags data (fallback)
  const mockTags: Tag[] = [
    { _id: 't1', name: 'Energy Efficient' },
    { _id: 't2', name: 'Smart' },
    { _id: 't3', name: 'Dimmable' },
    { _id: 't4', name: 'Commercial' },
    { _id: 't5', name: 'Waterproof' },
    { _id: 't6', name: 'RGB' },
    { _id: 't7', name: 'Industrial' },
    { _id: 't8', name: 'Outdoor' }
  ];

  useEffect(() => {
    fetchTags();
  }, []);

  // Sync search terms with URL when on catalog page
  useEffect(() => {
    if (location.pathname === '/catalog') {
      const urlParams = new URLSearchParams(location.search);
      const searchParam = urlParams.get('search');
      if (searchParam) {
        const decodedSearch = decodeURIComponent(searchParam);
        setSearchTerm(decodedSearch);
        setMobileSearchTerm(decodedSearch);
      } else {
        setSearchTerm('');
        setMobileSearchTerm('');
      }
    }
  }, [location.pathname, location.search]);

  const fetchTags = async () => {
    try {
      const response = await tagAPI.getAll();
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      // Fallback to mock data if API fails
      setTags(mockTags);
    }
  };

  const handleTagClick = (tagId: string, tagName: string) => {
    // Navigate to catalog with tag filter
    navigate(`/catalog?tag=${tagId}&tagName=${encodeURIComponent(tagName)}`);
  };

  const handleAllProductsClick = () => {
    // Navigate to catalog without filters and clear any existing URL parameters
    navigate('/catalog', { replace: true });
  };

  const handleSearch = (term: string) => {
    if (term.trim()) {
      // Navigate to catalog with search parameter
      navigate(`/catalog?search=${encodeURIComponent(term.trim())}`);
    } else {
      // Navigate to catalog without search if empty
      navigate('/catalog');
    }
  };

  const handleSearchBarClick = () => {
    // Navigate to catalog when search bar is clicked
    navigate('/catalog');
  };

  const handleDesktopSearchChange = (value: string) => {
    setSearchTerm(value);
    // If user is already on catalog page, update the search in real-time
    if (location.pathname === '/catalog') {
      if (value.trim()) {
        navigate(`/catalog?search=${encodeURIComponent(value.trim())}`, { replace: true });
      } else {
        navigate('/catalog', { replace: true });
      }
    }
  };

  const handleMobileSearchChange = (value: string) => {
    setMobileSearchTerm(value);
    // If user is already on catalog page, update the search in real-time
    if (location.pathname === '/catalog') {
      if (value.trim()) {
        navigate(`/catalog?search=${encodeURIComponent(value.trim())}`, { replace: true });
      } else {
        navigate('/catalog', { replace: true });
      }
    }
  };

  const handleDesktopSearch = () => {
    handleSearch(searchTerm);
  };

  const handleMobileSearch = () => {
    handleSearch(mobileSearchTerm);
    setIsMobileSearchOpen(false); // Close mobile search after searching
  };

  const handleDesktopSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDesktopSearch();
    }
  };

  const handleMobileSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleMobileSearch();
    }
  };

  return (
    <header className="w-full shadow-lg bg-white sticky top-0 z-50">
      {/* Top accent bar with LUMIZO brand colors */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9E1B] via-[#0067A0] to-[#008C95]" />
      
      <div className="mx-auto px-4 sm:px-6 py-3 sm:py-4">
        {/* Main navigation bar */}
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center cursor-pointer group" onClick={() => navigate("/")}>
            {/* LUMIZO Logo */}
            <div className="relative flex-shrink-0">
              <img 
                src={logo} 
                alt="LUMIZO Logo" 
                className="h-8 sm:h-10 md:h-12 w-auto transition-transform group-hover:scale-105" 
              />
            </div>
            
            {/* Separator */}
            <div className="mx-3 sm:mx-4 h-8 sm:h-10 md:h-12 w-px bg-gradient-to-b from-transparent via-[#888B8D] to-transparent"></div>
            
            {/* Product Portal with Lightbulb */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-[#FF9E1B] to-[#0067A0] rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF9E1B]/30 to-[#0067A0]/30 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-[#FF9E1B] to-[#0067A0] bg-clip-text text-transparent">
                  Product Portal
                </h1>
                <p className="text-xs sm:text-sm text-[#53565A] font-medium hidden md:block">
                  Smart Lighting Solutions
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#888B8D]" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => handleDesktopSearchChange(e.target.value)}
                onKeyPress={handleDesktopSearchKeyPress}
                onFocus={handleSearchBarClick}
                placeholder="Search products, brands, or categories..."
                className="w-full pl-10 pr-16 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FF9E1B] focus:ring-2 focus:ring-[#FF9E1B]/20 transition-all"
              />
              <Button
                size="sm"
                onClick={handleDesktopSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FF9E1B] hover:bg-[#FF9E1B]/90 text-white px-3"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Action buttons and menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-[#53565A] hover:text-[#FF9E1B] hover:bg-[#FF9E1B]/10 p-2"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Menu dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#53565A] hover:text-[#0067A0] hover:bg-[#0067A0]/10 border-2 border-transparent hover:border-[#0067A0]/20 p-2"
                >
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white shadow-xl border border-gray-200">
                <DropdownMenuLabel>
                  <div className="flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-[#FF9E1B]" />
                    <span className="font-semibold text-[#53565A]">Sales Tools</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/catalog")} className="hover:bg-[#FF9E1B]/10">
                  <Lightbulb className="w-4 h-4 mr-2 text-[#FF9E1B]" />
                  Product Catalog
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin-panel")} className="hover:bg-[#FF9E1B]/10">
                  <User className="w-4 h-4 mr-2 text-[#0067A0]" />
                  Admin Panel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")} className="hover:bg-[#008C95]/10">
                  <Settings className="w-4 h-4 mr-2 text-[#008C95]" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/help")} className="hover:bg-[#888B8D]/10">
                  <Lightbulb className="w-4 h-4 mr-2 text-[#888B8D]" />
                  Help & Support
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="lg:hidden mt-3 animate-in slide-in-from-top-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#888B8D]" />
              <Input
                type="text"
                value={mobileSearchTerm}
                onChange={(e) => handleMobileSearchChange(e.target.value)}
                onKeyPress={handleMobileSearchKeyPress}
                onFocus={handleSearchBarClick}
                placeholder="Search products..."
                className="w-full pl-10 pr-16 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FF9E1B] focus:ring-2 focus:ring-[#FF9E1B]/20"
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleMobileSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FF9E1B] hover:bg-[#FF9E1B]/90 text-white px-3"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Secondary navigation for tags - Responsive */}
        <div className="mt-3 sm:mt-4">
          {/* Desktop tag navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 text-sm overflow-x-auto">
            <button 
              onClick={handleAllProductsClick}
              className="text-[#53565A] hover:text-[#FF9E1B] font-medium transition-colors whitespace-nowrap"
            >
              All Products
            </button>
            {(tags.length > 0 ? tags : mockTags).slice(0, 6).map((tag) => (
              <button 
                key={tag._id}
                onClick={() => handleTagClick(tag._id, tag.name)}
                className="text-[#53565A] hover:text-[#0067A0] font-medium transition-colors whitespace-nowrap"
              >
                {tag.name}
              </button>
            ))}
            {(tags.length > 0 ? tags : mockTags).length > 6 && (
              <button 
                onClick={handleAllProductsClick}
                className="text-[#888B8D] hover:text-[#FF9E1B] font-medium transition-colors whitespace-nowrap"
              >
                +{(tags.length > 0 ? tags : mockTags).length - 6} more
              </button>
            )}
          </div>

          {/* Mobile tag navigation - horizontal scroll */}
          <div className="md:hidden">
            <div className="flex gap-4 text-sm overflow-x-auto pb-2 scrollbar-hide">
              <button 
                onClick={handleAllProductsClick}
                className="text-[#53565A] hover:text-[#FF9E1B] font-medium transition-colors whitespace-nowrap flex-shrink-0"
              >
                All Products
              </button>
              {(tags.length > 0 ? tags : mockTags).slice(0, 8).map((tag) => (
                <button 
                  key={tag._id}
                  onClick={() => handleTagClick(tag._id, tag.name)}
                  className="text-[#53565A] hover:text-[#0067A0] font-medium transition-colors whitespace-nowrap flex-shrink-0"
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
