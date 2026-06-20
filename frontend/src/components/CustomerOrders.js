import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/orders/my')
      .then((data) => setOrders(data.reverse()))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusText = (status) => {
    const map = {
      pending: '待确认',
      preparing: '制作中',
      ready: '已出餐',
      completed: '已送达'
    };
    return map[status] || status;
  };

  if (loading) {
    return <div className="empty-state">正在加载您的订单...</div>;
  }

  return (
    <div className="page-section">
      <div className="section-header">
        <span className="section-label">My Orders</span>
        <h2 className="section-title">我的订单</h2>
      </div>
      {orders.length === 0 ? (
        <div className="empty-state">暂无订单记录</div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <div>
                <div className="order-number">No. {order.orderNumber}</div>
                <div className="order-meta">
                  {order.customer} · 桌号 {order.tableNumber}
                </div>
                <div className="order-time">
                  {new Date(order.createdAt).toLocaleString('zh-CN')}
                </div>
              </div>
              <span className={`order-status status-${order.status}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            <div className="order-items">
              {order.items.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="order-item-row">
                  <span>{item.name} × {item.quantity}</span>
                  <span>¥{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="order-total">合计 ¥{order.total}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default CustomerOrders;
