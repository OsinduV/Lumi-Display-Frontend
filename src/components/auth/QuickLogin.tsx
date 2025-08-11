import React, { useState } from 'react';
import { Eye, EyeOff, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { USERS } from "@/config/auth.config";

interface QuickLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const QuickLogin: React.FC<QuickLoginProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // Find user by password
      const user = Object.values(USERS).find(u => u.password === password.trim());
      
      if (user) {
        const success = await login({ username: user.username, password: password.trim() });
        if (success) {
          setPassword('');
          onClose();
          if (onSuccess) {
            onSuccess();
          }
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-[#0067A0]" />
            <span>Quick Login</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-[#888B8D]">
            Enter your password to view prices and access features
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Enter password"
                  className="pl-10 pr-10 focus:border-[#FF9E1B] focus:ring-[#FF9E1B]/20"
                  disabled={isLoading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-[#888B8D] hover:text-[#53565A]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full bg-[#FF9E1B] hover:bg-[#FF9E1B]/90 text-white"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </div>
              )}
            </Button>
          </form>

          {/* Help Text */}
          <div className="text-xs text-[#888B8D] text-center pt-2 border-t border-gray-200">
            <p>Use your admin or sales password to access pricing information</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickLogin;
