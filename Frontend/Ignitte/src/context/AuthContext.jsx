import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/utils/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await authAPI.getCurrentUser();
        setUser(response.data.user);
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // In Frontend/Ignitte/src/context/AuthContext.jsx

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    
    if (response.data && response.data.data) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        const user = response.data.data.user;
        setUser(user);
        return user; // <--- Return the user here
    }
    throw new Error("Login failed");
  };

  // Change the register function to this:
  const register = async (fullName, email, password, department, phone) => {
  // Notice the keys match what the backend expects
  const response = await authAPI.register({ fullName, email, password, department, phone });
  
  // Also fix the data access path we discussed earlier
  if (response.data && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      setUser(response.data.data.user);
  }
};
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};