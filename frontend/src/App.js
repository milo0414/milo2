import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Admin from './components/Admin';
import Orders from './components/Orders';

function App() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existing = prevCart.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== id));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <div className="header">
        <h1>🍽️ 自动点餐系统</h1>
        <nav className="nav">
          <NavLink to="/">点餐</NavLink>
          <NavLink to="/orders">订单</NavLink>
          <NavLink to="/admin">后台管理</NavLink>
        </nav>
      </div>
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Menu addToCart={addToCart} />
                {cart.length > 0 && (
                  <Cart
                    cart={cart}
                    updateQuantity={updateQuantity}
                    total={cartTotal}
                  />
                )}
              </>
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                cart={cart}
                total={cartTotal}
                clearCart={clearCart}
              />
            }
          />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
