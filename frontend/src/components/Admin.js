import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

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

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setMenu(data);
    } catch (error) {
      console.error('获取菜单失败:', error);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await apiFetch(`/api/menu/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify({ ...form, price: Number(form.price) })
        });
      } else {
        await apiFetch('/api/menu', {
          method: 'POST',
          body: JSON.stringify({ ...form, price: Number(form.price) })
        });
      }
      resetForm();
      fetchMenu();
    } catch (error) {
      console.error('保存失败:', error);
      alert(error.message || '保存失败');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      price: String(item.price),
      category: item.category,
      description: item.description || '',
      image: item.image || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除这道菜品吗？')) return;
    try {
      await apiFetch(`/api/menu/${id}`, { method: 'DELETE' });
      fetchMenu();
    } catch (error) {
      console.error('删除失败:', error);
      alert(error.message || '删除失败');
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setForm({ name: '', price: '', category: '', description: '', image: '' });
  };

  return (
    <div className="page-section">
      <div className="section-header">
        <span className="section-label">Menu Management</span>
        <h2 className="section-title">菜单管理</h2>
      </div>

      <div className="admin-grid">
        <div className="panel">
          <h3 className="panel-title">{editingItem ? '编辑菜品' : '新增菜品'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">菜品名称</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">价格</label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">分类</label>
              <input
                id="category"
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="热菜、素菜、汤类、主食"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">描述</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label htmlFor="image">图片 URL</label>
              <input
                id="image"
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="可选"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-gold">
                {editingItem ? '更新' : '添加'}
              </button>
              {editingItem && (
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  取消
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="panel admin-list">
          <h3 className="panel-title">菜品列表</h3>
          {menu.map((item) => (
            <div key={item.id} className="admin-list-item">
              <div>
                <div className="admin-item-name">{item.name}</div>
                <div className="admin-item-meta">¥{item.price} · {item.category}</div>
              </div>
              <div className="admin-item-actions">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => handleEdit(item)}>
                  编辑
                </button>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
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
