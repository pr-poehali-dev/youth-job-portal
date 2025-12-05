import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  completedTest: boolean;
  testResult?: string;
  role: 'user' | 'employer';
  subscription?: 'basic' | 'premium' | null;
  subscriptionExpiry?: string;
  companyName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, age: number) => Promise<boolean>;
  registerEmployer: (name: string, email: string, password: string, companyName: string) => Promise<boolean>;
  logout: () => void;
  updateTestResult: (result: string) => void;
  updateSubscription: (subscription: 'basic' | 'premium' | null, expiryDate?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let needsUpdate = false;
    
    // Создаём аккаунт работодателя если его нет
    const employerExists = users.some((u: any) => u.email === 'mininkonstantin@gmail.com');
    
    if (!employerExists) {
      const employerUser = {
        id: 'employer_admin',
        name: 'Администратор',
        email: 'mininkonstantin@gmail.com',
        password: 'admin123',
        age: 25,
        completedTest: true,
        role: 'employer'
      };
      users.push(employerUser);
      needsUpdate = true;
    }
    
    // Добавляем role для старых пользователей
    users.forEach((u: any) => {
      if (!u.role) {
        u.role = u.email === 'mininkonstantin@gmail.com' ? 'employer' : 'user';
        needsUpdate = true;
      }
    });
    
    if (needsUpdate) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, age: number): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some((u: any) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      age,
      completedTest: false,
      role: 'user' as const,
      subscription: null
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const registerEmployer = async (name: string, email: string, password: string, companyName: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some((u: any) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      age: 25,
      completedTest: true,
      role: 'employer' as const,
      companyName,
      subscription: null
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateTestResult = (result: string) => {
    if (user) {
      const updatedUser = { ...user, completedTest: true, testResult: result };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], completedTest: true, testResult: result };
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  const updateSubscription = (subscription: 'basic' | 'premium' | null, expiryDate?: string) => {
    if (user) {
      const updatedUser = { ...user, subscription, subscriptionExpiry: expiryDate };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], subscription, subscriptionExpiry: expiryDate };
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, registerEmployer, logout, updateTestResult, updateSubscription }}>
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