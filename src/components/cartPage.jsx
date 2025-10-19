import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/authContext';
import '../App.css';



const CartPage = ({ setCurrentPage }) => {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.0625;
  const fee = 6;
  const total = subtotal + tax + fee;

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="cart-empty">
          <p className="cart-empty-text">Your cart is empty</p>
          <button 
            className="btn-continue btn"
            onClick={() => setCurrentPage('catalog')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="catalog-header">Shopping Cart</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image"></div>
              <div className="cart-item-info">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-price">${Number(item.price).toFixed(2)}</p>
              </div>
              <div className="cart-item-controls">
                <div className="quantity">
                  <button 
                    className="btn-quantity"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    className="btn-quantity"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button 
                  className="btn-delete btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="cart-summary-title">Order Summary</h2>
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>${Number(subtotal).toFixed(2)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Tax (6.25%)</span>
            <span>${Number(tax).toFixed(2)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Fee (6)</span>
            <span>${Number(fee).toFixed(2)}</span>
          </div>
          <div className="cart-summary-total">
            <span>Total</span>
            <span>${Number(total).toFixed(2)}</span>
          </div>
          <button 
            className="btn-action btn"
            onClick={() => setCurrentPage('payment')}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
export { CartPage };