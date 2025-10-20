import '../App.css';

const HomePage = () => {
  return (
<div className="container">
      <div className="home-header">
        <h1>Welcome to Test E-Commerce</h1>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3 className="feature-title">Features</h3>
          <p className="feature-text">In Admin page, there is an opportunity to order by name, description, price, role, etc.</p>
          <p className="feature-text">Search bar is working based on name, description.</p>
        </div>

        <div className="feature-card">
          <h3 className="feature-title">Routes</h3>
          <p className="feature-text">Users: CRUD</p>
          <p className="feature-text">Items: CRUD</p>
          <p className="feature-text">Orders: Create, Read</p>
          <p className="feature-text">Order_descriptions: Create, Read</p>
        </div>

        <div className="feature-card">
          <h3 className="feature-title">Security</h3>
          <p className="feature-text">Restricted access to previous pages after User logout</p>
          <p className="feature-text">Controllers for users and admins are separated</p>
          <p className="feature-text">User doesn't have access to admin routes</p>
        </div>
      </div>
    </div>
  );
};
export { HomePage };