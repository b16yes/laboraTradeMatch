import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, TradeCategory } from '../types/models';
import { AuthService, mockDefaultTradesman } from '../services/firebase/authService';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  toggleAvailability: () => void;
  updateTrades: (selectedCategories: TradeCategory[]) => void;
  addReference: (authorName: string, role: 'Client' | 'Peer Tradesman' | 'Subcontractor', rating: number, comment: string, tradeContext: TradeCategory) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  toggleAvailability: () => {},
  updateTrades: () => {},
  addReference: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(mockDefaultTradesman);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    AuthService.getCurrentUser().then((profile) => {
      setUser(profile);
      setIsLoading(false);
    });
  }, []);

  const toggleAvailability = () => {
    if (!user) return;
    const newStatus = !user.isAvailable;
    setUser({ ...user, isAvailable: newStatus });
    AuthService.updateAvailability(user.uid, newStatus);
  };

  const updateTrades = (selectedCategories: TradeCategory[]) => {
    if (!user) return;
    const updatedTrades = selectedCategories.map((cat, idx) => {
      const existing = user.trades.find((t) => t.category === cat);
      return {
        id: existing?.id || `trade-${idx}-${Date.now()}`,
        category: cat,
        isPrimary: idx === 0,
        yearsExperience: existing?.yearsExperience || 5,
        licenseNumber: existing?.licenseNumber,
      };
    });
    setUser({ ...user, trades: updatedTrades });
  };

  const addReference = (
    authorName: string,
    authorRole: 'Client' | 'Peer Tradesman' | 'Subcontractor',
    rating: number,
    comment: string,
    tradeContext: TradeCategory
  ) => {
    if (!user) return;
    const newRef = {
      id: `ref-${Date.now()}`,
      authorName,
      authorRole,
      rating,
      date: 'Today',
      comment,
      tradeContext,
    };
    setUser({
      ...user,
      references: [newRef, ...user.references],
      totalReviews: user.totalReviews + 1,
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, toggleAvailability, updateTrades, addReference }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
