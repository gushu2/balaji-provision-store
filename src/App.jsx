import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ShopCategory from './pages/ShopCategory';
import Cart from './components/Cart';
import ScrollToTop from './components/ScrollToTop';
import { placeOrder } from './api';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, newQty) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = (orderData) => {
    // Logic to send order to backend
    console.log("Order Placed:", orderData);
    placeOrder(orderData)
      .then(data => {
        alert(`Order Placed Successfully! Order ID: ${data.orderId}`);
        setCartItems([]);
        setIsCartOpen(false);
      })
      .catch(err => alert('Failed to place order'));
  };

  return (
    <div className="min-h-screen bg-orange-50/30 font-sans text-stone-800">
      <ScrollToTop />
      <Navbar cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} onSearch={setSearchQuery} />

      <main className="pt-24 pb-12">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} searchQuery={searchQuery} />} />
          <Route path="/pooja" element={<ShopCategory category="Pooja Needs" title="Pooja Essentials" addToCart={addToCart} searchQuery={searchQuery} />} />
          <Route path="/groceries" element={<ShopCategory category="Groceries" title="Groceries & Spices" addToCart={addToCart} searchQuery={searchQuery} />} />
          <Route path="/sarees" element={<ShopCategory category="Sarees" title="Sarees & Textiles" addToCart={addToCart} searchQuery={searchQuery} />} />
          <Route path="/decor" element={<ShopCategory category="Decor" title="Home Decor & Festival" addToCart={addToCart} searchQuery={searchQuery} />} />
          <Route path="/daily" element={<ShopCategory category="Daily Needs" title="Daily Needs" addToCart={addToCart} searchQuery={searchQuery} />} />
        </Routes>
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      <footer className="bg-stone-900 text-stone-400 py-12 px-6 mt-12 border-t-4 border-orange-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="text-orange-500 font-bold text-lg mb-4 font-serif">New Balaji Provision Store</h3>
            <p>Kundapura's most trusted name for quality groceries, authentic pooja items, and daily essentials serving for over 100 years.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="/pooja" className="hover:text-orange-400">Pooja Needs</a></li>
              <li><a href="/groceries" className="hover:text-orange-400">Groceries</a></li>
              <li><a href="/sarees" className="hover:text-orange-400">Sarees</a></li>
              <li><a href="/decor" className="hover:text-orange-400">Decor</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Contact Us</h4>
            <p className="font-semibold text-orange-200 mb-1">Owner: K. Ganesh Nayak</p>
            <p>Main Road, Kundapura - 576201</p>
            <p>Phone: 9481023617 / 7899423617</p>
            <p>Email: kgnayak617@gmail.com</p>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-stone-800">
          <p>&copy; 2026 New Balaji Provision Store Kundapura. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
