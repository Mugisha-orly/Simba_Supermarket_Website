import React, { useState, useEffect } from 'react';
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
  onAuthOpen,
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [mobileSearch, setMobileSearch] = useState('');

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
            <div className="navbar-top-left" />
            <div className="navbar-top-right">
              {/* Dark Mode Toggle */}
              <button
                className="navbar-top-btn"
                onClick={() => setDarkMode(!darkMode)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, textTransform: 'none' }}
                title={t('nav.dark_mode')}
              >
                {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                <span className="navbar-top-label">{t('nav.dark_mode')}</span>
              </button>

              <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.3)', margin: '0 8px' }} />

              {/* Language Selector */}
              <div style={{ position: 'relative' }}>
                <button
                  id="language-switcher-btn"
                  className="navbar-top-btn"
                  onClick={() => setShowLang(!showLang)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, textTransform: 'none' }}
                >
                  <Globe size={13} />
                  <span>{currentLang.flag} {currentLang.label}</span>
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
                        padding: '8px', zIndex: 1000, minWidth: 180,
                        border: '1px solid #F0F0F5'
                      }}
                    >
                      {languages.map(lang => (
                        <button
                          key={lang.code}
                          id={`lang-${lang.code}`}
                          onClick={() => changeLanguage(lang.code)}
                          style={{
                            width: '100%', padding: '10px 14px', borderRadius: 8,
                            display: 'flex', alignItems: 'center', gap: 10,
                            fontSize: 13, fontWeight: 600,
                            color: i18n.language === lang.code ? '#FF5722' : '#2C2C3E',
                            background: i18n.language === lang.code ? '#FFF3EE' : 'transparent',
                            textAlign: 'left', transition: '0.2s'
                          }}
                        >
                          <span style={{ fontSize: 16 }}>{lang.flag}</span>
                          {lang.label}
                          {i18n.language === lang.code && (
                            <span style={{ marginLeft: 'auto', fontSize: 10, color: '#FF5722', fontWeight: 800 }}>✓</span>
                          )}
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
            <div className="navbar-logo" id="nav-logo" onClick={() => onCategorySelect('All')} style={{ cursor: 'pointer' }}>
              <img src={SIMBA_LOGO} alt="Simba" className="navbar-logo-img"
                onError={e => { e.target.style.display = 'none'; }} />
              <div className="navbar-logo-text">
                <span className="navbar-logo-title">SIMBA<span>.</span></span>
                <span className="navbar-logo-sub">Supermarket</span>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="navbar-search">
              <input
                id="desktop-search-input"
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
                id="btn-wishlist"
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
                id="btn-cart"
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
                <div style={{ position: 'relative' }}>
                  <button
                    id="btn-user-menu"
                    className="navbar-cta"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    {user?.picture ? (
                      <img src={user.picture} alt={user.name} style={{ width: 20, height: 20, borderRadius: '50%' }} />
                    ) : (
                      <User size={16} />
                    )}
                    <span>{t('nav.hi', { name: user.name.split(' ')[0] })}</span>
                    <ChevronDown size={12} style={{ transition: '0.3s', transform: showUserMenu ? 'rotate(180deg)' : 'none' }} />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        style={{
                          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                          background: 'var(--bg-card)', borderRadius: 14, boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                          border: '1px solid var(--border-light)', padding: 8, zIndex: 500, minWidth: 180,
                        }}
                      >
                        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-light)', marginBottom: 4 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{user.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.email}</div>
                        </div>
                        <button
                          id="btn-my-account"
                          onClick={() => { setCurrentView('customer'); setShowUserMenu(false); }}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text)', background: 'transparent', transition: '0.2s', textAlign: 'left' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--orange-tint)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <User size={14} color="#FF5722" />
                          {t('nav.my_account')}
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => { setCurrentView(currentView === 'admin' ? 'store' : 'admin'); setShowUserMenu(false); }}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text)', background: 'transparent', transition: '0.2s', textAlign: 'left' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--orange-tint)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <Settings size={14} color="#FF5722" />
                            {currentView === 'admin' ? 'Storefront' : 'Admin Panel'}
                          </button>
                        )}
                        <button
                          id="btn-logout"
                          onClick={() => { onLogout(); setShowUserMenu(false); }}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#EF4444', background: 'transparent', transition: '0.2s', textAlign: 'left' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <LogOut size={14} />
                          {t('nav.sign_out')}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  id="btn-signin-nav"
                  className="navbar-cta"
                  onClick={onAuthOpen}
                >
                  <User size={16} />
                  <span>{t('nav.signin')}</span>
                </button>
              )}

              {/* Mobile menu */}
              <button id="btn-mobile-menu" className="mobile-menu-btn" onClick={() => setShowMobile(true)}>
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
                  id="btn-departments"
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

        {/* Mobile sticky search bar */}
        <div className="mobile-search-bar">
          <div className="container">
            <div style={{ position: 'relative', padding: '8px 0' }}>
              <input
                id="mobile-search-input"
                type="text"
                placeholder={t('mobile.search_placeholder')}
                className="mobile-search-input"
                value={mobileSearch}
                onChange={e => { setMobileSearch(e.target.value); onSearch(e.target.value); }}
              />
              <Search size={16} className="mobile-search-icon" />
              {mobileSearch && (
                <button
                  onClick={() => { setMobileSearch(''); onSearch(''); }}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}
                >
                  <X size={14} />
                </button>
              )}
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

              {/* Logo in mobile menu */}
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
                  id="mobile-btn-wishlist"
                  onClick={() => { onWishlistOpen(); setShowMobile(false); }}
                  style={{ flex: 1, padding: '12px', background: '#FFF3EE', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#FF5722' }}
                >
                  <Heart size={16} fill="#FF5722" /> {t('nav.wishlist')} {wishlistCount > 0 && `(${wishlistCount})`}
                </button>
                <button
                  id="mobile-btn-cart"
                  onClick={() => { onCartOpen(); setShowMobile(false); }}
                  style={{ flex: 1, padding: '12px', background: '#FF5722', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'white' }}
                >
                  <ShoppingCart size={16} /> {t('nav.cart')} {cartCount > 0 && `(${cartCount})`}
                </button>
              </div>

              {/* User info or sign in */}
              {user ? (
                <div style={{ background: 'var(--bg)', borderRadius: 14, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} style={{ width: 40, height: 40, borderRadius: 12, border: '2px solid #FF5722' }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FF5722', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16 }}>
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      id="mobile-btn-my-account"
                      onClick={() => { setCurrentView('customer'); setShowMobile(false); }}
                      style={{ flex: 1, padding: '10px', background: '#FFF3EE', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#FF5722', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                      <User size={14} /> {t('mobile.my_account')}
                    </button>
                    <button
                      id="mobile-btn-logout"
                      onClick={() => { onLogout(); setShowMobile(false); }}
                      style={{ flex: 1, padding: '10px', background: '#FEF2F2', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                      <LogOut size={14} /> {t('mobile.sign_out')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  id="mobile-btn-signin"
                  className="navbar-cta"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => { setShowMobile(false); onAuthOpen(); }}
                >
                  <User size={16} /> {t('mobile.sign_in')}
                </button>
              )}

              {/* Language Switcher in mobile */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Globe size={13} /> {t('mobile.language')}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      id={`mobile-lang-${lang.code}`}
                      onClick={() => changeLanguage(lang.code)}
                      style={{
                        padding: '10px 14px', borderRadius: 10,
                        display: 'flex', alignItems: 'center', gap: 8,
                        fontSize: 13, fontWeight: 600,
                        color: i18n.language === lang.code ? '#FF5722' : 'var(--text)',
                        background: i18n.language === lang.code ? '#FFF3EE' : 'var(--bg)',
                        border: `1.5px solid ${i18n.language === lang.code ? '#FF5722' : 'var(--border-light)'}`,
                        transition: '0.2s', textAlign: 'left',
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{lang.flag}</span>
                      <span style={{ fontSize: 12 }}>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark mode toggle */}
              <button
                id="mobile-btn-darkmode"
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12,
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 13, fontWeight: 700,
                  background: darkMode ? 'rgba(255,87,34,0.1)' : 'var(--bg)',
                  color: darkMode ? '#FF5722' : 'var(--text)',
                  border: `1.5px solid ${darkMode ? '#FF5722' : 'var(--border-light)'}`,
                  transition: '0.2s',
                }}
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                {t('mobile.dark_mode')}
              </button>

              {/* Categories */}
              <div>
                <div className="mobile-cat-label" style={{ marginBottom: 12 }}>
                  {t('mobile.categories')}
                </div>
                <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {(categories || []).map(cat => (
                    <button key={cat}
                      id={`mobile-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                      className={`mobile-cat-btn${activeCategory === cat ? ' active' : ''}`}
                      onClick={() => { onCategorySelect(cat); setShowMobile(false); }}
                    >
                      {cat} <ChevronDown size={16} style={{ transform: 'rotate(-90deg)', opacity: 0.3 }} />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
