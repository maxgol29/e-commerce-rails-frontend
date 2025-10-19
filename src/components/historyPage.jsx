import { useState, useEffect } from 'react';
import { get } from '../api/axios';
import '../App.css';

export const HistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fee = 6;
  const tax = 0.065;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await get('/orders.json');
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        alert('Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Loading previous orders...</h2>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container">
        <h1 className="catalog-header">Order History</h1>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>You haven't made any orders yet</h3>
          <p style={{ color: '#666', marginTop: '10px' }}>Start shopping to see your order history here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="catalog-header">Order History</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        Total Orders: {orders.length}
      </p>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {orders.map(order => (
          <div
            key={order.id}
            style={{
              border: '2px solid #ddd',
              borderRadius: '8px',
              marginBottom: '20px',
              overflow: 'hidden',
              transition: 'all 0.3s'
            }}
          >
            <div
              onClick={() => toggleOrder(order.id)}
              style={{
                padding: '20px',
                background: expandedOrder === order.id ? 'rgba(2, 150, 176, 1)' : '#f9f9f9',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background 0.3s',
                color: expandedOrder === order.id ? '#fff' : '#333'
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>Order #{order.id}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  ${Number(order.amount).toFixed(2)}
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                  {order.orders_descriptions.length} item{order.orders_descriptions.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div style={{ fontSize: '1.5rem' }}>
                {expandedOrder === order.id ? '▲' : '▼'}
              </div>
            </div>
            {expandedOrder === order.id && (
              <div style={{ padding: '20px', background: '#fff' }}>
                <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>
                  Order Items:
                </h4>
                <div style={{ borderTop: '1px solid #eee' }}>
                  {order.orders_descriptions.map((desc, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '15px 0',
                        borderBottom: index < order.orders_descriptions.length - 1 ? '1px solid #eee' : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                          {desc.item.name}
                        </h4>
                        {desc.item.description && (
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                            {desc.item.description.substring(0, 100)}
                            {desc.item.description.length > 100 ? '...' : ''}
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: 'center', minWidth: '80px' }}>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                          Qty: {desc.quantity}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: '100px' }}>
                        <p style={{ margin: 0, fontWeight: 'bold', color: 'rgba(2, 150, 176, 1)' }}>
                          ${Number(desc.item.price).toFixed(2)}
                        </p>
                        <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                          Total: ${(Number(desc.item.price) * desc.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>
                      Fee 
                    </h4>
                    <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: 'rgba(2, 150, 176, 1)', float: 'right' }}>
                      ${fee.toFixed(2)}
                    </p>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>
                      Tax 
                    </h4>
                    <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: 'rgba(2, 150, 176, 1)', float: 'right' }}>
                      ${(order.amount * tax).toFixed(2)}
                    </p>
                </div>
                <div
                  style={{
                    marginTop: '20px',
                    paddingTop: '15px',
                    borderTop: '2px solid rgba(2, 150, 176, 1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                    Order Total:
                  </span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'rgba(2, 150, 176, 1)' }}>
                    ${Number(order.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};