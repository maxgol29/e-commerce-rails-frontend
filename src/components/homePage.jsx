import '../App.css';

const HomePage = () => {
  return (
    <div className="container">
      <div className="home-header">
        <h1>Welcome to Test E-Commerce</h1>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3 className="feature-title">Data</h3>
          <p className="feature-text">On orders over $50</p>
        </div>

        <div className="feature-card">
          <h3 className="feature-title">Routes</h3>
          <p className="feature-text">100% secure transactions</p>
        </div>

        <div className="feature-card">
          <h3 className="feature-title">Security</h3>
          <p className="feature-text">Top rated products</p>
        </div>
      </div>
    </div>
  );
};
export { HomePage };