import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PORTALS = [
  {
    role: 'customer',
    title: 'Guest Dining',
    subtitle: '贵宾用餐',
    description: '品鉴主厨精选菜单，尊享私人订制点餐体验',
    redirect: '/customer/menu'
  },
  {
    role: 'staff',
    title: 'Service Desk',
    subtitle: '侍者工作台',
    description: '接待宾客订单，统筹厨房出品与餐桌服务',
    redirect: '/staff/orders'
  }
];

function PortalCard({ portal }) {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEnter = async () => {
    setLoading(true);
    try {
      await login(portal.role);
      navigate(portal.redirect);
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`portal-card portal-${portal.role}`}
      onClick={handleEnter}
      disabled={loading}
    >
      <span className="portal-label">{portal.subtitle}</span>
      <h2 className="portal-title">{portal.title}</h2>
      <div className="portal-divider" />
      <p className="portal-desc">{portal.description}</p>
      <span className="portal-action">
        {loading ? '请稍候...' : '进入 →'}
      </span>
    </button>
  );
}

function Home() {
  return (
    <div className="home-page">
      <header className="home-hero">
        <p className="home-tagline">Michelin · Fine Dining</p>
        <h1 className="home-brand">L&apos;Étoile</h1>
        <p className="home-subtitle">三星米其林 · 臻享私宴</p>
        <div className="home-divider" />
        <p className="home-prompt">请选择您的身份</p>
      </header>
      <div className="portal-grid">
        {PORTALS.map((portal) => (
          <PortalCard key={portal.role} portal={portal} />
        ))}
      </div>
      <footer className="home-footer">
        <span>Est. 2024</span>
        <span className="home-footer-dot">·</span>
        <span>Paris · Shanghai</span>
      </footer>
    </div>
  );
}

export default Home;
