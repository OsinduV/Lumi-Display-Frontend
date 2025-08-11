import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/components/auth/Login';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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
      } else {
        // Redirect based on role would be handled by the calling component
        navigate('/catalog');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <Login 
      onLogin={handleLogin}
      isLoading={isLoginLoading}
      error={loginError}
    />
  );
};

export default LoginPage;
