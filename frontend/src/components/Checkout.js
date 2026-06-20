import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Checkout({ cart, total, clearCart }) {
  const [customer, setCustomer] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total,
          customer,
          tableNumber
        })
      });

      if (res.ok) {
        clearCart();
        alert('下单成功！');
        navigate('/orders');
      }
    } catch (error) {
      console.error('下单失败:', error);
      alert('下单失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>购物车为空</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          去点餐
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>确认订单</h2>
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>订单详情</h3>
        {cart.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <span>{item.name} x {item.quantity}</span>
            <span>¥{item.price * item.quantity}</span>
          </div>
        ))}
        <div style={{ textAlign: 'right', marginTop: '15px', fontSize: '1.3rem', fontWeight: 'bold' }}>
          总计: ¥{total}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
        <div className="form-group">
          <label>顾客姓名</label>
          <input
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            required
            placeholder="请输入顾客姓名"
          />
        </div>
        <div className="form-group">
          <label>桌号</label>
          <input
            type="text"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            required
            placeholder="请输入桌号"
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn"
            style={{ flex: 1, background: '#ddd' }}
            onClick={() => navigate('/')}
          >
            返回
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 1 }}
            disabled={loading}
          >
            {loading ? '提交中...' : '确认下单'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
