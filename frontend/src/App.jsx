import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AISearchDrawer from './components/AISearchDrawer';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import ProductDetail from './components/ProductDetail';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Bot } from 'lucide-react';
import { SIMBA_BRANCHES, DEFAULT_BRANCH } from './data/branches';

function App() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Auth state — user object + JWT token persisted in localStorage
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('simba_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('simba_token') || null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [orderType, setOrderType] = useState('Delivery');
  const [selectedBranch, setSelectedBranch] = useState(DEFAULT_BRANCH);

  // Cart & wishlist stay in memory (session only)
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Drawer state
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [aiSearchOpen, setAiSearchOpen] = useState(false);

  const [currentView, setCurrentView] = useState('store');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('simba_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Products loaded from the backend
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Orders loaded from the backend
  const [orders, setOrders] = useState([]);

  const productsRef = useRef(null);

  // ── Fetch products from backend ────────────────────────────────────────────
  useEffect(() => {
    setProductsLoading(true);
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setProductsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products:', err);
        setProductsLoading(false);
      });
  }, []);

  // ── Fetch orders from backend when user is logged in ──────────────────────
  useEffect(() => {
    if (!token) { setOrders([]); return; }
    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to load orders:', err));
  }, [token]);

  // ── Dark mode ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('simba_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('simba_theme', 'light');
    }
  }, [darkMode]);

  // ── Scroll / back-to-top ──────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 800);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Scroll lock when drawers/modal open ───────────────────────────────────
  useEffect(() => {
    document.body.style.overflow =
      (cartOpen || wishlistOpen || authModalOpen || aiSearchOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen, wishlistOpen, authModalOpen, aiSearchOpen]);

  // ── Cart handlers ─────────────────────────────────────────────────────────
  const handleAddToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty < 1) { handleRemoveFromCart(id); return; }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty: newQty } : i));
  };

  const handleRemoveFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));
  const handleClearCart = () => setCartItems([]);

  // ── Checkout gate ─────────────────────────────────────────────────────────
  const [checkoutAsGuest, setCheckoutAsGuest] = useState(false);

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutAsGuest(!!user);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = async (userData, authToken) => {
    // authToken is null when the user was already logged in (skipToSuccess path).
    // In that case keep the existing token; only persist when a fresh token is issued.
    const effectiveToken = authToken || token;

    setUser(userData);
    if (authToken) {
      setToken(authToken);
      localStorage.setItem('simba_user', JSON.stringify(userData));
      localStorage.setItem('simba_token', authToken);
    }

    setAuthModalOpen(false);
    setCheckoutAsGuest(false);

    // Post order to backend
    if (cartItems.length > 0 && effectiveToken) {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${effectiveToken}`,
          },
          body: JSON.stringify({ items: cartItems, type: orderType, branch: selectedBranch }),
        });
        if (response.ok) {
          const newOrder = await response.json();
          setOrders(prev => [newOrder, ...prev]);
        }
      } catch (err) {
        console.error('Failed to create order:', err);
      }
    }

    setCartItems([]);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handleAuthModalClose = () => {
    setAuthModalOpen(false);
    setCheckoutAsGuest(false);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('simba_user');
    localStorage.removeItem('simba_token');
    setOrders([]);
    setCurrentView('store');
  };

  // ── Admin: toggle product stock ───────────────────────────────────────────
  const handleToggleStock = async (productId, currentStock) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inStock: !currentStock }),
      });
      if (response.ok) {
        const updated = await response.json();
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      }
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
  };

  // ── Wishlist handlers ─────────────────────────────────────────────────────
  const handleToggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      return exists ? prev.filter(i => i.id !== product.id) : [...prev, product];
    });
  };

  const handleRemoveFromWishlist = (id) => setWishlistItems(prev => prev.filter(i => i.id !== id));

  // ── Product filtering ─────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    const lang = i18n.resolvedLanguage || 'en';

    let result = products.filter(p => {
      const nameObj = p?.name || {};
      const nameStr = typeof nameObj === 'string' ? nameObj : (nameObj[lang] || nameObj.en || '');
      const catObj = p?.category || {};
      const catStr = typeof catObj === 'string' ? catObj : (catObj[lang] || catObj.en || '');
      return nameStr.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (activeCategory === 'All' || catStr === activeCategory);
    });

    if (sortBy === 'PriceLow') result.sort((a, b) => (a?.price || 0) - (b?.price || 0));
    else if (sortBy === 'PriceHigh') result.sort((a, b) => (b?.price || 0) - (a?.price || 0));

    return result;
  }, [searchQuery, activeCategory, sortBy, products, i18n.resolvedLanguage]);

  const categories = useMemo(() => {
    if (!Array.isArray(products)) return ['All'];
    const lang = i18n.resolvedLanguage || 'en';
    const cats = [...new Set(products.map(p => {
      const c = p?.category;
      return typeof c === 'string' ? c : (c?.[lang] || c?.en);
    }).filter(Boolean))];
    return ['All', ...cats];
  }, [products, i18n.resolvedLanguage]);

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setSelectedProduct(null);
    if (cat !== 'All') setTimeout(() => productsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const wishlistCount = wishlistItems.length;
  const wishlistIds = new Set(wishlistItems.map(i => i.id));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onSearch={setSearchQuery}
        onCategorySelect={handleCategorySelect}
        activeCategory={activeCategory}
        categories={categories}
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
        onAISearchOpen={() => setAiSearchOpen(true)}
        user={user}
        currentView={currentView}
        setCurrentView={setCurrentView}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLogout={handleLogout}
      />

      {currentView === 'admin' ? (
        <AdminDashboard
          orders={orders}
          products={products}
          onToggleStock={handleToggleStock}
          updateOrderStatus={updateOrderStatus}
          onBackToStore={() => setCurrentView('store')}
        />
      ) : currentView === 'customer' && user ? (
        <CustomerDashboard
          orders={orders.filter(o => o.customer?.email === user.email)}
          onBackToStore={() => setCurrentView('store')}
        />
      ) : selectedProduct ? (
        <ProductDetail
          product={selectedProduct}
          products={products}
          onBack={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlistIds}
          onProductClick={setSelectedProduct}
        />
      ) : (
        <main>
          <AnimatePresence mode="wait">
            {activeCategory === 'All' && searchQuery === '' && (
              <motion.div
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Hero onShopNow={() => productsRef.current?.scrollIntoView({ behavior: 'smooth' })} />
              </motion.div>
            )}
          </AnimatePresence>

          <CategoryGrid
            categories={categories}
            activeCategory={activeCategory}
            onCategorySelect={handleCategorySelect}
          />

          <div id="products-section" ref={productsRef}>
            <ProductGrid
              products={filteredProducts}
              loading={productsLoading}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalCount={filteredProducts.length}
              onProductClick={setSelectedProduct}
            />
          </div>
        </main>
      )}

      {currentView !== 'admin' && <Footer />}

      {/* Drawers */}
      <AISearchDrawer
        isOpen={aiSearchOpen}
        onClose={() => setAiSearchOpen(false)}
        products={products}
        searchQuery={searchQuery}
        onAddToCart={(p) => { handleAddToCart(p); setCartOpen(true); }}
      />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveFromCart}
        onClear={handleClearCart}
        onCheckout={handleCheckout}
        user={user}
        orderType={orderType}
        setOrderType={setOrderType}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={handleAuthModalClose}
        onAuthSuccess={handleAuthSuccess}
        cartItems={cartItems}
        skipToSuccess={checkoutAsGuest}
        user={user}
        orderType={orderType}
        selectedBranch={selectedBranch}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemove={handleRemoveFromWishlist}
        onAddToCart={(product) => { handleAddToCart(product); setCartOpen(true); }}
      />

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className="back-to-top"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title="Back to top"
          >
            <ChevronUp size={22} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* AI Floating Action Button */}
      <motion.button
        className="ai-fab"
        onClick={() => setAiSearchOpen(true)}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Ask Simba AI"
      >
        <Bot size={28} className="ai-fab-icon" />
      </motion.button>
    </div>
  );
}

export default App;
