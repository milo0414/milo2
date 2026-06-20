import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Admin from './components/Admin';
import Orders from './components/Orders';
import CustomerOrders from './components/CustomerOrders';

function Header({ variant }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isCustomer = variant === 'customer';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={`site-header ${isCustomer ? 'header-customer' : 'header-staff'}`}>
      <div className="header-inner">
        <div className="header-brand">
          <span className="header-tagline">{isCustomer ? 'Guest Dining' : 'Service Desk'}</span>
          <h1>L&apos;Étoile</h1>
        </div>
        <div className="header-right">
          <span className="header-user">{user.displayName}</span>
          <button type="button" className="btn-text" onClick={handleLogout}>
            退出
          </button>
        </div>
      </div>
      <nav className="nav">
        {isCustomer ? (
          <>
            <NavLink to="/customer/menu">菜单</NavLink>
            <NavLink to="/customer/orders">我的订单</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/staff/orders">订单管理</NavLink>
            <NavLink to="/staff/admin">菜单管理</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

function CustomerRoutes() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    }
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Header variant="customer" />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/customer/menu" replace />} />
          <Route
            path="/menu"
            element={
              <>
                <Menu addToCart={addToCart} />
                {cart.length > 0 && (
                  <Cart cart={cart} updateQuantity={updateQuantity} total={cartTotal} />
                )}
              </>
            }
          />
          <Route
            path="/checkout"
            element={<Checkout cart={cart} total={cartTotal} clearCart={clearCart} />}
          />
          <Route path="/orders" element={<CustomerOrders />} />
        </Routes>
      </main>
    </>
  );
}

function StaffRoutes() {
  return (
    <>
      <Header variant="staff" />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/staff/orders" replace />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute role="customer">
            <CustomerRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/*"
        element={
          <ProtectedRoute role="staff">
            <StaffRoutes />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
