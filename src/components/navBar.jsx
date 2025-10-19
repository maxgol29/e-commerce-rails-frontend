import { ShoppingCart, Home, Package, User, LogOut, History } from 'lucide-react';
import { useAuth, useCart } from '../contexts/authContext';
import '../App.css';

export const Navbar = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="nav-text">
        <span>E-Commerce Client</span>
      </div>
      
      <div className="nav-links">
        <button
          className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentPage('home')}
        >
          <Home size={20} />
          <span>Home</span>
        </button>
        
        <button
          className={`nav-link ${currentPage === 'catalog' ? 'active' : ''}`}
          onClick={() => setCurrentPage('catalog')}
        >
          <Package size={20} />
          <span>Catalog</span>
        </button>

        <button
          className={`nav-link ${currentPage === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentPage('history')}
        >
          <History size={20} />
          <span>Orders</span>
        </button>
        
        <button
          className={`nav-link cart-link ${currentPage === 'cart' ? 'active' : ''}`}
          onClick={() => setCurrentPage('cart')}
        >
          <ShoppingCart size={20} />
          <span>Cart</span>
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </button>
        
        <button
          className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentPage('profile')}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
        
        <button className="nav-link logout-btn" onClick={logout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
      
      {user && (
        <div className="nav-user">
          <span>Welcome, {user.first_name}</span>
        </div>
      )}
    </nav>
  );
};