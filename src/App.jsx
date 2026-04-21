import React, { useState, useMemo, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AuthModal from './components/AuthModal';
import productData from './data/simba_products.json';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Auth state
  const [user, setUser] = useState(null); // { name, email }
  const [authModalOpen, setAuthModalOpen] = useState(false);
  // Cart state: [{...product, qty}]
  const [cartItems, setCartItems] = useState([]);
  // Wishlist state: [...product]
  const [wishlistItems, setWishlistItems] = useState([]);
  // Drawer open state
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const productsRef = useRef(null);
  const products = productData?.products || [];

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 800);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when drawer or modal is open
  useEffect(() => {
    document.body.style.overflow = (cartOpen || wishlistOpen || authModalOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen, wishlistOpen, authModalOpen]);

  /* ── Cart handlers ── */
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty < 1) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty: newQty } : i));
  };

  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const handleClearCart = () => setCartItems([]);

  // Checkout gate — requires login
  const [checkoutAsGuest, setCheckoutAsGuest] = useState(false);

  const handleCheckout = () => {
    setCartOpen(false);
    if (user) {
      // Already logged in — skip straight to success
      setCheckoutAsGuest(true);
    } else {
      setCheckoutAsGuest(false);
    }
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setAuthModalOpen(false);
    setCheckoutAsGuest(false);
    setCartItems([]);
  };

  const handleAuthModalClose = () => {
    setAuthModalOpen(false);
    setCheckoutAsGuest(false);
  };

  /* ── Wishlist handlers ── */
  const handleToggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      return exists ? prev.filter(i => i.id !== product.id) : [...prev, product];
    });
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(i => i.id !== id));
  };

  /* ── Products ── */
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    let result = products.filter(p => {
      const name = (p?.name || '').toLowerCase();
      const category = p?.category || '';
      return name.includes(searchQuery.toLowerCase()) &&
        (activeCategory === 'All' || category === activeCategory);
    });
    if (sortBy === 'PriceLow') result.sort((a, b) => (a?.price || 0) - (b?.price || 0));
    else if (sortBy === 'PriceHigh') result.sort((a, b) => (b?.price || 0) - (a?.price || 0));
    return result;
  }, [searchQuery, activeCategory, sortBy, products]);

  const categories = useMemo(() => {
    if (!Array.isArray(products)) return ['All'];
    const cats = [...new Set(products.map(p => p?.category).filter(Boolean))];
    return ['All', ...cats];
  }, [products]);

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    if (cat !== 'All') {
      setTimeout(() => productsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const wishlistCount = wishlistItems.length;
  const wishlistIds = new Set(wishlistItems.map(i => i.id));

  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onSearch={setSearchQuery}
        onCategorySelect={handleCategorySelect}
        activeCategory={activeCategory}
        categories={categories}
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
        user={user}
      />

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
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalCount={filteredProducts.length}
          />
        </div>
      </main>

      <Footer />

      {/* Drawers */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveFromCart}
        onClear={handleClearCart}
        onCheckout={handleCheckout}
        user={user}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={handleAuthModalClose}
        onAuthSuccess={handleAuthSuccess}
        cartItems={cartItems}
        skipToSuccess={checkoutAsGuest}
        user={user}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemove={handleRemoveFromWishlist}
        onAddToCart={(product) => {
          handleAddToCart(product);
          setCartOpen(true);
        }}
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
    </div>
  );
}

export default App;
