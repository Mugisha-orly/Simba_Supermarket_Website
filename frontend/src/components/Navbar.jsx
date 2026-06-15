import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, User, Menu, Heart, ChevronDown, X, Sparkles, Globe, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import SimbaLogo from '../assets/Simba_Logo.PNG';

const SIMBA_LOGO = SimbaLogo;

const Navbar = ({
  cartCount, wishlistCount,
  onSearch, onCategorySelect,
  activeCategory, categories,
  onCartOpen, onWishlistOpen,
  onAISearchOpen,
  user,
  currentView,
  setCurrentView,
  darkMode,
  setDarkMode,
  onLogout,
}) => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [showDepts, setShowDepts] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [toast, setToast] = useState('');

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'sw', label: 'Kiswahili', flag: '🇹🇿' }
  ];

  const currentLang = languages.find(l => l.code === (i18n.language || 'en')) || languages[0];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setShowLang(false);
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
            </div>
            <div className="navbar-top-right">
              {/* Dark Mode Toggle */}
              <button 
                className="navbar-top-btn" 
                onClick={() => setDarkMode(!darkMode)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, textTransform: 'none' }}
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={14} /> : <Moon size={14} />}
              </button>

              <div style={{ width: 1, height: 14, background: 'var(--border-light)', margin: '0 8px' }} />

              {/* Language Selector */}
              <div style={{ position: 'relative' }}>
                <button 
                  className="navbar-top-btn" 
                  onClick={() => setShowLang(!showLang)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, textTransform: 'none' }}
                >
                  <Globe size={13} />
                  {currentLang.label}
                  <ChevronDown size={12} style={{ transition: '0.3s', transform: showLang ? 'rotate(180deg)' : 'none' }} />
                </button>

                <AnimatePresence>
                  {showLang && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                        background: 'white', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        padding: '8px', zIndex: 1000, minWidth: 160,
                        border: '1px solid #F0F0F5'
                      }}
                    >
                      {languages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          style={{
                            width: '100%', padding: '10px 14px', borderRadius: 8,
                            display: 'flex', alignItems: 'center', gap: 10,
                            fontSize: 13, fontWeight: 600, color: i18n.language === lang.code ? '#FF5722' : '#2C2C3E',
                            background: i18n.language === lang.code ? '#FFF3EE' : 'transparent',
                            textAlign: 'left', transition: '0.2s'
                          }}
                        >
                          <span style={{ fontSize: 16 }}>{lang.flag}</span>
                          {lang.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                placeholder={t('nav.search')}
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
                title={t('nav.wishlist')}
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
                title={t('nav.cart')}
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

              {/* Sign in / user menu */}
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button className="navbar-cta" onClick={() => setCurrentView('customer')}>
                    {user?.picture ? (
                      <img src={user.picture} alt={user.name} style={{ width: 20, height: 20, borderRadius: '50%' }} />
                    ) : (
                      <User size={16} />
                    )}
                    <span>{t('nav.hi', { name: user.name.split(' ')[0] })}</span>
                  </button>
                  <button
                    className="navbar-icon-btn"
                    onClick={onLogout}
                    title="Sign out"
                    style={{ color: 'var(--text-light)' }}
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button className="navbar-cta" onClick={() => showToast('Login during checkout to track orders')}>
                  <User size={16} />
                  <span>{t('nav.signin')}</span>
                </button>
              )}

              {/* Admin Toggle — only visible to admin users */}
              {user?.role === 'admin' && (
                <button
                  className="navbar-cta"
                  style={{ background: 'var(--primary)' }}
                  onClick={() => setCurrentView(currentView === 'admin' ? 'store' : 'admin')}
                >
                  <Settings size={16} />
                  <span>{currentView === 'admin' ? 'Storefront' : 'Admin'}</span>
                </button>
              )}

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
              <div 
                style={{ position: 'relative' }}
                onMouseEnter={() => setShowDepts(true)}
                onMouseLeave={() => setShowDepts(false)}
              >
                <button
                  className="subnav-departments-btn"
                  onClick={() => setShowDepts(!showDepts)}
                >
                  <Menu size={16} />
                  {t('nav.departments')}
                  <ChevronDown size={14} style={{ transition: '0.3s', transform: showDepts ? 'rotate(180deg)' : 'none' }} />
                </button>

                <AnimatePresence>
                  {showDepts && (
                    <motion.div
                      className="departments-dropdown"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
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
                <div className="mobile-cat-label" style={{ marginBottom: 16 }}>Categories</div>
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
