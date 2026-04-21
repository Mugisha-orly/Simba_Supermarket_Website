import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, User, Menu, Heart, Phone, MapPin, ChevronDown, X, Sparkles, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SIMBA_LOGO = "https://scontent.fnbo1-1.fna.fbcdn.net/v/t39.30808-1/305616999_515241433938254_7819237593280698956_n.jpg?stp=dst-jpg_tt6&cstp=mx714x714&ctp=s714x714&_nc_cat=108&ccb=1-7&_nc_sid=3ab345&_nc_ohc=aE2Skg3MqGsQ7kNvwFUxMjI&_nc_oc=AdqQ7hHIbgJo2C98oI-bTyn_N9bh9q3wMLqXANgqx30DJhFr9Ic66FEZIY4WC-CPbNE3V7hvXD7kLsmPj0x6sikh&_nc_zt=24&_nc_ht=scontent.fnbo1-1.fna.fbcdn.net&_nc_gid=6cPx3AacY8Izepxx7UvAng&_nc_ss=7a389&oh=00_Af0k7mXZG_Kad_3bYd-alpTpzO8aEZvP0iAxaCgz0zKfXg&oe=69ED1DDC";

const Navbar = ({
  cartCount, wishlistCount,
  onSearch, onCategorySelect,
  activeCategory, categories,
  onCartOpen, onWishlistOpen,
  user
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [showDepts, setShowDepts] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const quickCats = (categories || []).filter(c => c !== 'All').slice(0, 6);

  return (
    <>
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div className="toast"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            <Sparkles size={14} color="#FF5722" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top info bar */}
      <div className="navbar-top">
        <div className="container">
          <div className="navbar-top-inner">
            <div className="navbar-top-left">
              <div className="navbar-top-item">
                <MapPin size={13} /> Kigali Heights & Gishushu, Rwanda
              </div>
              <div className="navbar-top-item">
                <Phone size={13} /> +250 788 300 000
              </div>
            </div>
            <div className="navbar-top-right">
              {/* Removed Virtual Tour, Rewards, and Store Locator per user request */}
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`navbar-main${scrolled ? ' scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-inner">

            {/* Logo */}
            <div className="navbar-logo" onClick={() => onCategorySelect('All')} style={{ cursor: 'pointer' }}>
              <img src={SIMBA_LOGO} alt="Simba" className="navbar-logo-img"
                onError={e => { e.target.style.display = 'none'; }} />
              <div className="navbar-logo-text">
                <span className="navbar-logo-title">SIMBA<span>.</span></span>
                <span className="navbar-logo-sub">Supermarket</span>
              </div>
            </div>

            {/* Search */}
            <div className="navbar-search">
              <input
                type="text"
                className="navbar-search-input"
                placeholder="Search products, brands, categories..."
                onChange={e => onSearch(e.target.value)}
              />
              <Search size={18} className="navbar-search-icon" />
            </div>

            {/* Action buttons */}
            <div className="navbar-actions">

              {/* Wishlist */}
              <button
                className="navbar-icon-btn"
                onClick={onWishlistOpen}
                title="Wishlist"
                style={{ position: 'relative' }}
              >
                <Heart size={20} fill={wishlistCount > 0 ? '#FF5722' : 'none'} color={wishlistCount > 0 ? '#FF5722' : 'currentColor'} />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      key={wishlistCount}
                      className="navbar-cart-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{ background: '#FF5722' }}
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Cart */}
              <button
                className="navbar-icon-btn"
                onClick={onCartOpen}
                title="Shopping Cart"
                style={{ position: 'relative' }}
              >
                <ShoppingCart size={20} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      className="navbar-cart-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Sign in / user */}
              <button className="navbar-cta" onClick={() => !user && showToast('Already signed in!')}>
                <User size={16} />
                <span>{user ? `Hi, ${user.name.split(' ')[0]}` : 'Sign In'}</span>
              </button>

              {/* Mobile menu */}
              <button className="mobile-menu-btn" onClick={() => setShowMobile(true)}>
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="navbar-subnav">
          <div className="container">
            <div className="navbar-subnav-inner">
              {/* Departments dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  className="subnav-departments-btn"
                  onMouseEnter={() => setShowDepts(true)}
                  onMouseLeave={() => setShowDepts(false)}
                >
                  <Menu size={16} />
                  All Departments
                  <ChevronDown size={14} style={{ transition: '0.3s', transform: showDepts ? 'rotate(180deg)' : 'none' }} />
                </button>

                <AnimatePresence>
                  {showDepts && (
                    <motion.div
                      className="departments-dropdown"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      onMouseEnter={() => setShowDepts(true)}
                      onMouseLeave={() => setShowDepts(false)}
                    >
                      {(categories || []).map(cat => (
                        <div
                          key={cat}
                          className={`dept-item${activeCategory === cat ? ' active' : ''}`}
                          onClick={() => { onCategorySelect(cat); setShowDepts(false); }}
                        >
                          {cat}
                          <ChevronDown size={14} style={{ transform: 'rotate(-90deg)', opacity: 0.4 }} />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {quickCats.map(cat => (
                <button
                  key={cat}
                  className={`subnav-cat-btn${activeCategory === cat ? ' active' : ''}`}
                  onClick={() => onCategorySelect(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobile && (
          <div className="mobile-menu">
            <motion.div className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobile(false)}
            />
            <motion.div className="mobile-menu-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            >
              <button className="mobile-menu-close" onClick={() => setShowMobile(false)}>
                <X size={20} />
              </button>

              <div className="navbar-logo" onClick={() => { onCategorySelect('All'); setShowMobile(false); }}>
                <img src={SIMBA_LOGO} alt="Simba" className="navbar-logo-img" />
                <div className="navbar-logo-text">
                  <span className="navbar-logo-title">SIMBA<span>.</span></span>
                  <span className="navbar-logo-sub">Supermarket</span>
                </div>
              </div>

              {/* Mobile quick actions */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => { onWishlistOpen(); setShowMobile(false); }}
                  style={{ flex: 1, padding: '12px', background: '#FFF3EE', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#FF5722' }}
                >
                  <Heart size={16} fill="#FF5722" /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </button>
                <button
                  onClick={() => { onCartOpen(); setShowMobile(false); }}
                  style={{ flex: 1, padding: '12px', background: '#FF5722', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'white' }}
                >
                  <ShoppingCart size={16} /> Cart {cartCount > 0 && `(${cartCount})`}
                </button>
              </div>

              <div className="mobile-search" style={{ position: 'relative', marginTop: 0 }}>
                <input
                  placeholder="Search products..."
                  style={{ width: '100%', background: '#FFF9F7', border: '2px solid transparent', borderRadius: 12, padding: '12px 16px 12px 44px', fontSize: 14, outline: 'none' }}
                  onChange={e => { onSearch(e.target.value); setShowMobile(false); }}
                />
                <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
              </div>

              <div>
                <div className="mobile-cat-label" style={{ marginBottom: 16 }}>Departments</div>
                {(categories || []).map(cat => (
                  <button key={cat}
                    className={`mobile-cat-btn${activeCategory === cat ? ' active' : ''}`}
                    onClick={() => { onCategorySelect(cat); setShowMobile(false); }}
                  >
                    {cat} <ChevronDown size={16} style={{ transform: 'rotate(-90deg)', opacity: 0.3 }} />
                  </button>
                ))}
              </div>

              <button className="navbar-cta" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                onClick={() => showToast('Login coming soon!')}>
                <User size={16} /> Sign In / Register
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
