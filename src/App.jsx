import { useState,useEffect } from 'react';
import { AuthContext, CartContext } from './contexts/authContext';
import { AuthPage } from './components/authPage';
import { Navbar } from './components/navBar';
import { HomePage } from './components/homePage';
import { CatalogPage } from './components/catalogPage';
import { ProfilePage } from './components/profilePage';
import { HistoryPage } from './components/historyPage';
import './App.css';
import { CartPage } from './components/cartPage';
import { PaymentPage } from './components/paymentPage';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem('currentPage');
    return saved || 'home';
  });
  const [cart, setCart] = useState([]);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('home');
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('user');
    setCurrentPage('home');
    
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function() {
      window.history.pushState(null, null, window.location.href);
    };
  };

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
        <div className="app">
          {!user ? (
            <AuthPage />
          ) : (
            <>
              <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
              {currentPage === 'home' && <HomePage />}
              {currentPage === 'catalog' && <CatalogPage />}
              {currentPage === 'history' && <HistoryPage />}  
              {currentPage === 'cart' && <CartPage setCurrentPage={setCurrentPage} />}
              {currentPage === 'payment' && <PaymentPage setCurrentPage={setCurrentPage} />}
              {currentPage === 'profile' && <ProfilePage />}
            </>
          )}
        </div>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}