import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Menu({ addToCart }) {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setMenu(data);
      const cats = ['all', ...new Set(data.map(item => item.category))];
      setCategories(cats);
    } catch (error) {
      console.error('获取菜单失败:', error);
    }
  };

  const filteredMenu = selectedCategory === 'all'
    ? menu
    : menu.filter(item => item.category === selectedCategory);

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 20px',
              border: 'none',
              borderRadius: '20px',
              background: selectedCategory === cat ? '#667eea' : '#ddd',
              color: selectedCategory === cat ? 'white' : '#333',
              cursor: 'pointer',
              transition: '0.3s'
            }}
          >
            {cat === 'all' ? '全部' : cat}
          </button>
        ))}
      </div>
      <div className="menu-grid">
        {filteredMenu.map(item => (
          <div key={item.id} className="menu-item">
            <img src={item.image} alt={item.name} />
            <div className="menu-item-content">
              <span className="category">{item.category}</span>
              <h3>{item.name}</h3>
              <p className="description">{item.description}</p>
              <div className="price">¥{item.price}</div>
              <button
                className="btn btn-primary"
                onClick={() => addToCart(item)}
              >
                加入购物车
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
