import { useState, useEffect } from 'react';
import '../App.css';
import { useCart } from '../contexts/authContext';
import { get } from '../api/axios'; 

const CatalogPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();
  
  const itemsPerPage = 25;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await get('/items.json');
        setItems(data);
      } catch (err) {
        console.error('Error fetching items:', err);
        alert('Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="container"><h2>Loading...</h2></div>;
  }

  return (
    <div className="container">
      <h1 className="catalog-header">Item Catalog</h1>
      <div className='search-bar-container'>
        <input
          type="text"
          placeholder="Search products by name or description..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={(e) => e.target.style.borderColor = 'rgba(2, 150, 176, 1)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(177, 177, 177, 1)'}
          className='search-bar'
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className='clear-search-btn'
          >
            Clear
          </button>
        )}
      </div>
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '10px', 
          marginTop: '30px',
          marginBottom: '30px'
        }}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              background: currentPage === 1 ? '#f5f5f5' : '#fff',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 3 && page <= currentPage + 3)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid white',
                    background: currentPage === page ? 'rgba(2, 150, 176, 1)' : '#fff',
                    color: currentPage === page ? 'white' : '#333',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    fontWeight: currentPage === page ? 'bold' : 'normal'
                  }}
                >
                  {page}
                </button>
              );
            } else if (
              page === currentPage - 4 ||
              page === currentPage + 4
            ) {
              return <span key={page}>...</span>;
            }
            return null;
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              background: currentPage === totalPages ? 'white' : '#fff',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
          >
            Next
          </button>
        </div>
      )}

      {currentItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>No products found matching "{searchQuery}"</h3>
        </div>
      ) : (
      <div className="items-grid">
        {currentItems.map(item => (
          <div key={item.id} className="item-card">
            <div className="item-image">
              {item.name.charAt(0)}
            </div>
            <div className="item-info">
              <h3 className="item-name">{item.name}</h3>
              <div className="item-description-hover">
                <p>{item.description}</p>
              </div>
              <div className="item-footer">
                <span className="item-price">
                  ${Number(item.price).toFixed(2)}
                </span>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '10px', 
          marginTop: '30px',
          marginBottom: '30px'
        }}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              background: currentPage === 1 ? '#f5f5f5' : '#fff',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 3 && page <= currentPage + 3)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid white',
                    background: currentPage === page ? 'rgba(2, 150, 176, 1)' : '#fff',
                    color: currentPage === page ? 'white' : '#333',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    fontWeight: currentPage === page ? 'bold' : 'normal'
                  }}
                >
                  {page}
                </button>
              );
            } else if (
              page === currentPage - 4 ||
              page === currentPage + 4
            ) {
              return <span key={page}>...</span>;
            }
            return null;
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              background: currentPage === totalPages ? 'white' : '#fff',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
          >
            Next
          </button>
        </div>
      )}
      <p style={{ textAlign: 'center', color: 'grey', marginBottom: '20px' }}>
        {searchQuery ? (
          <>Found {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} - Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)}</>
        ) : (
          <>Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {items.length} items</>
        )}
      </p>
    </div>
  );
};

export { CatalogPage };