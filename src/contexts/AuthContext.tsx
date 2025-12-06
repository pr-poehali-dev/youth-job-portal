import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  phone?: string;
  completedTest: boolean;
  testResult?: string;
  role: 'user' | 'employer';
  subscription?: 'basic' | 'premium' | 'premium_plus' | null;
  subscriptionExpiry?: string;
  companyName?: string;
}

interface RegisterResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, age: number, phone?: string) => Promise<RegisterResult>;
  registerEmployer: (name: string, email: string, password: string, companyName: string) => Promise<boolean>;
  logout: () => void;
  updateTestResult: (result: string) => void;
  updateSubscription: (subscription: 'basic' | 'premium' | 'premium_plus' | null, expiryDate?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        
        // КРИТИЧНО: Проверяем на старый фейковый аккаунт
        if (parsed.id === 'employer_admin' || 
            (typeof parsed.id === 'string' && parsed.id.includes('employer_admin'))) {
          console.log('🔄 Обнаружен старый фейковый аккаунт работодателя! Очищаю localStorage...');
          localStorage.clear(); // Полная очистка
          setUser(null);
          alert('❗ Ваш аккаунт устарел. Пожалуйста, войдите заново:\n\nEmail: mininkonstantin@gmail.com\nПароль: secure_password_123');
          window.location.href = '/login';
          return;
        }
        
        setUser(parsed);
      } catch (e) {
        console.error('❌ Ошибка парсинга localStorage:', e);
        localStorage.removeItem('user');
        setUser(null);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('https://functions.poehali.dev/81ba1a01-47ea-40ac-9ce8-1dc2aa32d523?resource=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        console.error('Login failed:', response.status);
        return false;
      }
      
      const data = await response.json();
      const foundUser = data.user;
      
      if (foundUser) {
        const userToSet = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          age: foundUser.age,
          phone: foundUser.phone,
          completedTest: foundUser.completedTest,
          testResult: foundUser.testResult,
          role: foundUser.role || 'user',
          subscription: foundUser.subscription || null,
          companyName: foundUser.company_name
        };
        setUser(userToSet);
        localStorage.setItem('user', JSON.stringify(userToSet));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, age: number, phone?: string): Promise<RegisterResult> => {
    try {
      console.log('🚀 Регистрация через API:', { name, email, age, phone });
      
      const response = await fetch('https://functions.poehali.dev/81ba1a01-47ea-40ac-9ce8-1dc2aa32d523?resource=users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, age, phone: phone || '' })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Ошибка регистрации:', errorData);
        
        if (errorData.error === 'Email already exists') {
          return { success: false, error: 'Пользователь с таким email уже существует' };
        }
        return { success: false, error: 'Ошибка сервера при регистрации' };
      }

      const data = await response.json();
      console.log('✅ Регистрация успешна:', data);
      
      const userToSet = {
        id: data.id,
        name,
        email,
        age,
        phone,
        completedTest: false,
        role: 'user' as const,
        subscription: null
      };
      
      setUser(userToSet);
      localStorage.setItem('user', JSON.stringify(userToSet));
      
      return { success: true };
    } catch (error) {
      console.error('❌ Критическая ошибка:', error);
      return { success: false, error: 'Не удалось подключиться к серверу' };
    }
  };

  const registerEmployer = async (name: string, email: string, password: string, companyName: string): Promise<boolean> => {
    try {
      console.log('🚀 Регистрация работодателя через API:', { name, email, companyName });
      
      const response = await fetch('https://functions.poehali.dev/81ba1a01-47ea-40ac-9ce8-1dc2aa32d523?resource=users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          name, 
          age: 25,
          phone: '',
          role: 'employer'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Ошибка регистрации работодателя:', errorData);
        return false;
      }

      const data = await response.json();
      console.log('✅ Регистрация работодателя успешна:', data);
      
      const userToSet = {
        id: data.id,
        name,
        email,
        age: 25,
        completedTest: true,
        role: 'employer' as const,
        companyName,
        subscription: null
      };

      setUser(userToSet);
      localStorage.setItem('user', JSON.stringify(userToSet));
      
      return true;
    } catch (error) {
      console.error('❌ Критическая ошибка при регистрации работодателя:', error);
      return false;
    }
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

  const updateSubscription = (subscription: 'basic' | 'premium' | 'premium_plus' | null, expiryDate?: string) => {
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