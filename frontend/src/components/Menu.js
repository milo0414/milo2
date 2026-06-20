import React, { useState, useEffect } from 'react';
import AIRecommend from './AIRecommend';
import { apiFetch } from '../utils/api';

const API_BASE = process.env.REACT_APP_API_URL || '';

function Menu({ addToCart }) {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    apiFetch(`${API_BASE}/api/menu`)
      .then((data) => {
        setMenu(data);
        setCategories(['all', ...new Set(data.map((item) => item.category))]);
      })
      .catch(console.error);
  }, []);

  const filteredMenu =
    selectedCategory === 'all'
      ? menu
      : menu.filter((item) => item.category === selectedCategory);

  return (
    <div className="page-section">
      <div className="section-header">
        <span className="section-label">Menu</span>
        <h2 className="section-title">主厨精选</h2>
      </div>

      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'all' ? '全部' : cat}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filteredMenu.map((item) => (
          <article key={item.id} className="menu-item">
            <div className="menu-item-image">
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="menu-item-content">
              <span className="category">{item.category}</span>
              <h3>{item.name}</h3>
              <p className="description">{item.description}</p>
              <div className="menu-item-footer">
                <span className="price">¥{item.price}</span>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => addToCart(item)}
                >
                  加入订单
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <AIRecommend menu={filteredMenu} addToCart={addToCart} />
    </div>
  );
}

export default Menu;
