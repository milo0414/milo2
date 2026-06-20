import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await apiFetch('/api/orders');
      setOrders(data.reverse());
    } catch (error) {
      console.error('获取订单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const timer = setInterval(fetchOrders, 10000);
    return () => clearInterval(timer);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await apiFetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  const getStatusText = (status) => {
    const map = {
      pending: '待处理',
      preparing: '制作中',
      ready: '已出餐',
      completed: '已送达'
    };
    return map[status] || status;
  };

  if (loading) {
    return <div className="empty-state">正在加载订单...</div>;
  }

  return (
    <div className="page-section">
      <div className="section-header">
        <span className="section-label">Orders</span>
        <h2 className="section-title">订单管理</h2>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">暂无待处理订单</div>
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
            <div className="order-card-footer">
              <div className="order-total">合计 ¥{order.total}</div>
              <div className="order-actions">
                {order.status === 'pending' && (
                  <button
                    type="button"
                    className="btn btn-gold btn-sm"
                    onClick={() => updateStatus(order.id, 'preparing')}
                  >
                    开始制作
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    type="button"
                    className="btn btn-gold btn-sm"
                    onClick={() => updateStatus(order.id, 'ready')}
                  >
                    完成出餐
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => updateStatus(order.id, 'completed')}
                  >
                    确认送达
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
