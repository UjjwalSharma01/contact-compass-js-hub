
import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation - in real app, this would be API call
      if (email && password) {
        const userData = {
          id: Date.now().toString(),
          email,
          name: email.split('@')[0],
          createdAt: new Date().toISOString()
        };
        
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, confirmPassword) => {
    try {
      // Validate inputs
      if (!email || !password || !confirmPassword) {
        throw new Error('All fields are required');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
