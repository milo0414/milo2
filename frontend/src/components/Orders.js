import React, { useState, useEffect } from 'react';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.reverse());
    } catch (error) {
      console.error('获取订单失败:', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      ready: '已完成',
      completed: '已取餐'
    };
    return map[status] || status;
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>📋 订单列表</h2>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
          暂无订单
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
              <div>
                <div className="order-number">订单 # {order.orderNumber}</div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                  {order.customer} - {order.tableNumber}号桌
                </div>
                <div style={{ color: '#999', fontSize: '0.85rem', marginTop: '5px' }}>
                  {new Date(order.createdAt).toLocaleString('zh-CN')}
                </div>
              </div>
              <span className={`order-status status-${order.status}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            <div style={{ marginBottom: '15px' }}>
              {order.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>¥{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>合计: ¥{order.total}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {order.status === 'pending' && (
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: '0.9rem', padding: '6px 12px' }}
                    onClick={() => updateStatus(order.id, 'preparing')}
                  >
                    开始制作
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    className="btn btn-success"
                    style={{ fontSize: '0.9rem', padding: '6px 12px' }}
                    onClick={() => updateStatus(order.id, 'ready')}
                  >
                    完成
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    className="btn"
                    style={{ fontSize: '0.9rem', padding: '6px 12px', background: '#95a5a6', color: 'white' }}
                    onClick={() => updateStatus(order.id, 'completed')}
                  >
                    已取餐
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
