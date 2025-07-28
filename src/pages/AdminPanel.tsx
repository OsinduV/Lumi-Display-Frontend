import React, { useState } from "react";
import { 
  Package, 
  FolderTree, 
  Award, 
  Tag, 
  Menu, 
  X, 
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Login from "@/components/auth/Login";
import ManageProducts from "@/components/admin/ManageProducts";
import ManageCategories from "@/components/admin/ManageCategories";
import ManageBrands from "@/components/admin/ManageBrands";
import ManageTags from "@/components/admin/ManageTags";

const AdminPanel: React.FC = () => {
  const { user, isAuthenticated, login, logout, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("manage-products");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Handle login
  const handleLogin = async (credentials: { username: string; password: string }) => {
    setIsLoginLoading(true);
    setLoginError('');
    
    try {
      const success = await login(credentials);
      if (!success) {
        setLoginError('Invalid username or password. Please try again.');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setActiveTab("manage-products");
    setMobileMenuOpen(false);
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <Login 
        onLogin={handleLogin}
        isLoading={isLoginLoading}
        error={loginError}
      />
    );
  }

  // Show loading screen during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#FF9E1B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#888B8D]">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    {
      id: "manage-products",
      label: "Manage Products",
      icon: Package,
      color: "text-[#0067A0]",
      hoverColor: "hover:bg-[#0067A0]/10"
    },
    {
      id: "manage-categories",
      label: "Manage Categories",
      icon: FolderTree,
      color: "text-[#008C95]",
      hoverColor: "hover:bg-[#008C95]/10"
    },
    {
      id: "manage-brands",
      label: "Manage Brands",
      icon: Award,
      color: "text-[#FF9E1B]",
      hoverColor: "hover:bg-[#FF9E1B]/10"
    },
    {
      id: "manage-tags",
      label: "Manage Tags",
      icon: Tag,
      color: "text-[#0067A0]",
      hoverColor: "hover:bg-[#0067A0]/10"
    }
  ];

  const renderContent = () => {
    const activeItem = sidebarItems.find(item => item.id === activeTab);
    
    // Render specific component based on active tab
    switch (activeTab) {
      case 'manage-products':
        return <ManageProducts />;
      
      case 'manage-categories':
        return <ManageCategories />;
      
      case 'manage-brands':
        return <ManageBrands />;
      
      case 'manage-tags':
        return <ManageTags />;
      
      default:
        return (
          <div className="p-6 sm:p-8">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                {activeItem && <activeItem.icon className={`w-8 h-8 ${activeItem.color}`} />}
                <h1 className="text-2xl sm:text-3xl font-bold text-[#53565A]">
                  {activeItem?.label}
                </h1>
              </div>
              <p className="text-[#888B8D] text-sm sm:text-base">
                Welcome to the {activeItem?.label} section. Content for this section will be implemented here.
              </p>
            </div>

            {/* Placeholder content area */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <div className="flex items-center justify-center h-64 sm:h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  {activeItem && <activeItem.icon className={`w-16 h-16 mx-auto mb-4 ${activeItem.color} opacity-50`} />}
                  <h3 className="text-lg font-semibold text-[#53565A] mb-2">
                    {activeItem?.label} Interface
                  </h3>
                  <p className="text-[#888B8D] text-sm">
                    This section will contain the form and interface for {activeItem?.label.toLowerCase()}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 
        fixed lg:relative 
        inset-y-0 left-0 z-50 
        ${sidebarCollapsed ? 'w-16' : 'w-64'} 
        bg-white shadow-xl border-r border-gray-200 
        transition-all duration-300 ease-in-out
        flex flex-col h-full
      `}>
        {/* Sidebar Header - Fixed */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-[#FF9E1B] to-[#0067A0] rounded-lg">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-[#53565A]">Admin Panel</h2>
                  <p className="text-xs text-[#888B8D]">
                    Welcome, {user?.username} ({user?.role})
                  </p>
                </div>
              </div>
            )}
            
            {/* Collapse button - hidden on mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex text-[#888B8D] hover:text-[#53565A] p-1"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>

            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-[#888B8D] hover:text-[#53565A] p-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar Navigation - Scrollable */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-3 rounded-lg 
                  transition-all duration-200
                  ${isActive 
                    ? `bg-gradient-to-r from-[#FF9E1B]/10 to-[#0067A0]/10 border-l-4 border-[#FF9E1B] ${item.color}` 
                    : `text-[#888B8D] ${item.hoverColor} hover:text-[#53565A]`
                  }
                  ${sidebarCollapsed ? 'justify-center px-2' : ''}
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? item.color : ''}`} />
                {!sidebarCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer - Fixed */}
        {!sidebarCollapsed && (
          <div className="flex-shrink-0 p-4 border-t border-gray-200 space-y-3">
            {/* User Info & Logout */}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FF9E1B] to-[#0067A0] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#53565A]">{user?.username}</p>
                  <p className="text-xs text-[#888B8D] capitalize">{user?.role}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Version Info */}
            <div className="bg-gradient-to-r from-[#FF9E1B]/5 to-[#0067A0]/5 rounded-lg p-3">
              <p className="text-xs text-[#888B8D] text-center">
                LUMIZO Product Portal v1.0
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Floating Mobile Menu Button */}
        <Button
          variant="default"
          size="sm"
          className="lg:hidden fixed top-35 right-6 z-[60] bg-[#FF9E1B] hover:bg-[#FF9E1B]/90 text-white shadow-2xl rounded-full w-14 h-14 p-0 border-2 border-white"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </Button>

        {/* Content Area - Scrollable */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
