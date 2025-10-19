import { useState } from 'react';
import { useCart } from '../contexts/authContext';
import { useAuth } from '../contexts/authContext';
import { post } from '../api/axios';
import '../App.css';

export const PaymentPage = ({ setCurrentPage }) => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const order_price = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const tax = order_price * 0.0625;
  const fee = 6.00;
  const total = order_price + (tax + fee);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        order: {
          items: cart.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      };

      const data = await post('/orders', orderData);

      alert(`Payment successful! Order #${data.order_id} created. Total: $${data.amount}`);
      
      clearCart();
      setCurrentPage('home');

    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed: ' + (err.response?.data?.error || err.response?.data?.errors || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // if (cart.length === 0) {
  //   return (
  //     <div className="container">
  //       <h2>Your cart is empty</h2>
  //       <button onClick={() => setCurrentPage('catalog')} className="btn-primary">
  //         Continue Shopping
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Payment</h1>
      
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
              <span>{item.name} x {item.quantity}</span>
              <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
            <span>Fee:</span>
            <span>${fee.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '2px solid #000', fontSize: '1.4rem', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handlePayment}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Payment Method
            </label>
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cash">Upon Cash</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-action btn" 
            disabled={loading}
            style={{ width: '100%', padding: '15px', fontSize: '18px' }}
          >
            {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </button>
        </form>

        <button 
          onClick={() => setCurrentPage('cart')} 
          className="btn-cancel btn"
          style = {{ width: '100%', padding: '15px', fontSize: '18px', marginTop: '10px' }}
        >
          Back to Cart
        </button>
      </div>
    </div>
  );
};