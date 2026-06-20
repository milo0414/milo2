import React from 'react';
import { useNavigate } from 'react-router-dom';

function Cart({ cart, updateQuantity, total }) {
  const navigate = useNavigate();

  return (
    <aside className="cart">
      <div className="cart-header">
        <span className="section-label">Order</span>
        <h3>您的点单</h3>
      </div>
      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <div className="cart-item-info">
            <div className="cart-item-name">{item.name}</div>
            <div className="cart-item-price">¥{item.price}</div>
          </div>
          <div className="cart-controls">
            <button
              type="button"
              className="qty-btn"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              aria-label="减少"
            >
              −
            </button>
            <span className="qty-value">{item.quantity}</span>
            <button
              type="button"
              className="qty-btn"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label="增加"
            >
              +
            </button>
          </div>
        </div>
      ))}
      <div className="cart-total">
        <span>合计</span>
        <span>¥{total}</span>
      </div>
      <button
        type="button"
        className="btn btn-gold"
        onClick={() => navigate('/customer/checkout')}
      >
        确认结算
      </button>
    </aside>
  );
}

export default Cart;
