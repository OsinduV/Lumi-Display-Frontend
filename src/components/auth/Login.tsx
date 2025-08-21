import React, { useState } from "react";
import { Eye, EyeOff, Lightbulb, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LoginProps {
  onLogin: (credentials: { username: string; password: string }) => void;
  isLoading?: boolean;
  error?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading = false, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin({ username: username.trim(), password });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF9E1B]/10 via-gray-50 to-[#0067A0]/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="LUMIZO Logo" 
              className="h-16 w-auto" 
            />
            <div className="mx-4 h-16 w-px bg-gradient-to-b from-transparent via-[#888B8D] to-transparent"></div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-[#FF9E1B] to-[#0067A0] rounded-lg shadow-lg">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>

            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-2">
              <Lock className="w-6 h-6 text-[#0067A0] mr-2" />
              <CardTitle className="text-xl font-bold text-[#53565A]">
                Login
              </CardTitle>
            </div>
            <p className="text-sm text-[#888B8D]">
              Enter your credentials to access the system
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
             

              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#53565A]">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888B8D]" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your username"
                    className="pl-10 focus:border-[#FF9E1B] focus:ring-[#FF9E1B]/20"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#53565A]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888B8D]" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 focus:border-[#FF9E1B] focus:ring-[#FF9E1B]/20"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#888B8D] hover:text-[#53565A]"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF9E1B] to-[#0067A0] hover:from-[#FF9E1B]/90 hover:to-[#0067A0]/90 text-white font-medium py-2 h-11"
                disabled={isLoading || !username.trim() || !password.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-[#888B8D]">
            LUMIZO Product Portal v1.0 - Secure Access
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
