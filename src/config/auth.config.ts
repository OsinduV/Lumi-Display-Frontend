/**
 * Authentication Configuration
 * 
 * This file demonstrates different approaches for storing credentials
 * Choose the appropriate method based on your deployment environment
 */

// ========================================
// APPROACH 1: Environment Variables (Current Implementation)
// ========================================
// Pros: Easy to configure per environment, keeps secrets out of code
// Cons: Still visible in frontend bundle, not truly secure
// Best for: Development, staging, simple demos

export interface User {
  username: string;
  password: string;
  role: 'admin' | 'salesperson';
  fullName: string;
}

export const USERS: Record<string, User> = {
  admin: {
    username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
    password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin',
    role: 'admin',
    fullName: 'Administrator'
  },
  salesperson: {
    username: import.meta.env.VITE_SALES_USERNAME || 'sales',
    password: import.meta.env.VITE_SALES_PASSWORD || 'sales',
    role: 'salesperson',
    fullName: 'Sales Person'
  }
};

export const getAuthConfig = () => ({
  username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin'
});

// ========================================
// APPROACH 2: Backend Authentication (Recommended for Production)
// ========================================
// How it would work:
// 1. Frontend sends credentials to backend API
// 2. Backend validates against database/LDAP/OAuth
// 3. Backend returns JWT token or session cookie
// 4. Frontend stores token and sends it with API requests

/*
Example backend authentication flow:

export const loginWithAPI = async (credentials: LoginCredentials) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (response.ok) {
      const { token, user } = await response.json();
      localStorage.setItem('auth_token', token);
      return { success: true, user };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  } catch (error) {
    return { success: false, error: 'Login failed' };
  }
};
*/


// ========================================
// APPROACH 4: Hash-based Authentication
// ========================================
// Store password hashes instead of plain text
// Still not recommended for frontend-only auth
// You would need to install bcryptjs: npm install bcryptjs

export const HASH_CONFIG = {
  admin: {
    username: 'admin',
    // This would be a hash of 'admin123' if using bcrypt
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'admin'
  }
};

// ========================================
// APPROACH 5: OAuth/SSO Integration
// ========================================
// Use services like Auth0, Firebase Auth, AWS Cognito, etc.
// Most secure for production applications

/*
Example with Firebase Auth:

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase-config';

export const loginWithFirebase = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
*/

// ========================================
// RECOMMENDATION FOR YOUR USE CASE
// ========================================
// Since you want a simple solution without API calls:
// 1. Use environment variables (.env file) - Current implementation
// 2. Make sure .env is in .gitignore
// 3. Create .env.example with dummy values for other developers
// 4. Document the setup process

export default getAuthConfig;
