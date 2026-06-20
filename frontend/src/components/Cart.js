import React from 'react';
import { useNavigate } from 'react-router-dom';

function Cart({ cart, updateQuantity, total }) {
  const navigate = useNavigate();

  return (
    <div className="cart">
      <h3>🛒 购物车</h3>
      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <div>
            <div style={{ fontWeight: 'bold' }}>{item.name}</div>
            <div style={{ color: '#e74c3c' }}>¥{item.price}</div>
          </div>
          <div className="cart-controls">
            <button
              className="qty-btn"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              -
            </button>
            <span style={{ width: '30px', textAlign: 'center' }}>{item.quantity}</span>
            <button
              className="qty-btn"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
      ))}
      <div className="cart-total">
        总计: ¥{total}
      </div>
      <button
        className="btn btn-primary"
        style={{ marginTop: '15px' }}
        onClick={() => navigate('/checkout')}
      >
        去结算
      </button>
    </div>
  );
}

export default Cart;
