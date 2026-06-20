import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

function Checkout({ cart, total, clearCart }) {
  const [customer, setCustomer] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({ items: cart, total, customer, tableNumber })
      });
      clearCart();
      navigate('/customer/orders');
    } catch (err) {
      setError(err.message || '下单失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-state">
        <h2>您的点单为空</h2>
        <button type="button" className="btn btn-outline" onClick={() => navigate('/customer/menu')}>
          返回菜单
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="section-header">
        <span className="section-label">Checkout</span>
        <h2 className="section-title">确认订单</h2>
      </div>

      <div className="panel">
        <h3 className="panel-title">订单明细</h3>
        {cart.map((item) => (
          <div key={item.id} className="order-item-row">
            <span>{item.name} × {item.quantity}</span>
            <span>¥{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="checkout-total">
          <span>总计</span>
          <span>¥{total}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="panel">
        <h3 className="panel-title">宾客信息</h3>
        <div className="form-group">
          <label htmlFor="customer">姓名</label>
          <input
            id="customer"
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            required
            placeholder="请输入您的姓名"
          />
        </div>
        <div className="form-group">
          <label htmlFor="table">桌号</label>
          <input
            id="table"
            type="text"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            required
            placeholder="请输入桌号"
          />
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/customer/menu')}
          >
            返回
          </button>
          <button type="submit" className="btn btn-gold" disabled={loading}>
            {loading ? '提交中...' : '确认下单'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
