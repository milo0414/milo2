import React, { useState, useEffect } from 'react';

function Admin() {
  const [menu, setMenu] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setMenu(data);
    } catch (error) {
      console.error('获取菜单失败:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await fetch(`/api/menu/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, price: Number(form.price) })
        });
      } else {
        await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, price: Number(form.price) })
        });
      }
      resetForm();
      fetchMenu();
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm(item);
  };

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这个菜品吗？')) {
      try {
        await fetch(`/api/menu/${id}`, { method: 'DELETE' });
        fetchMenu();
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setForm({
      name: '',
      price: '',
      category: '',
      description: '',
      image: ''
    });
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>⚙️ 后台管理</h2>
      <div className="admin-grid">
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>
            {editingItem ? '编辑菜品' : '添加菜品'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>菜品名称</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>价格</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>分类</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="如：热菜、素菜、汤类、主食"
                required
              />
            </div>
            <div className="form-group">
              <label>描述</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>图片URL</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="可选"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                {editingItem ? '更新' : '添加'}
              </button>
              {editingItem && (
                <button type="button" className="btn" style={{ flex: 1, background: '#ddd' }} onClick={resetForm}>
                  取消
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', maxHeight: '600px', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '15px' }}>菜品列表</h3>
          {menu.map(item => (
            <div key={item.id} style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>¥{item.price} - {item.category}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn"
                  style={{ fontSize: '0.85rem', padding: '5px 10px', background: '#3498db', color: 'white' }}
                  onClick={() => handleEdit(item)}
                >
                  编辑
                </button>
                <button
                  className="btn btn-danger"
                  style={{ fontSize: '0.85rem', padding: '5px 10px' }}
                  onClick={() => handleDelete(item.id)}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;
