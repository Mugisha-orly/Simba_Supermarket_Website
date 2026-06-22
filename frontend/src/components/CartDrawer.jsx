import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Minus, Plus, ArrowRight, ShoppingBag, User, LogIn, MapPin, Store, Map, ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SIMBA_BRANCHES } from '../data/branches';

const BranchMap = lazy(() => import('./BranchMap'));

const CartDrawer = ({
  isOpen, onClose,
  cartItems, onUpdateQty, onRemove, onClear, onCheckout,
  user,
  orderType, setOrderType,
  selectedBranch, setSelectedBranch,
}) => {
  const { t, i18n } = useTranslation();
  const [showMap, setShowMap] = useState(false);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal > 0 && orderType === 'Delivery' ? 2000 : 0;
  const total = subtotal + deliveryFee;
  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          >
            {/* Header */}
            <div className="drawer-header">
              <div className="drawer-title">
                <ShoppingCart size={20} color="#FF5722" />
                {t('cart.title')}
                {cartItems.length > 0 && (
                  <span className="drawer-title-count">{totalItems}</span>
                )}
              </div>
              <button className="drawer-close" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            {/* Logged-in user banner */}
            {user && (
              <div style={{
                margin: '0 28px 0',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: 12,
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 13,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: '#22c55e',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', flexShrink: 0,
                }}>
                  <User size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#166534' }}>
                    {t('cart.signed_in_as', { name: user.name })}
                  </div>
                  <div style={{ fontSize: 11, color: '#4ade80' }}>{user.email}</div>
                </div>
              </div>
            )}

            {/* Body */}
            <div className="drawer-body" style={{ paddingTop: user ? 12 : 20 }}>
              {cartItems.length === 0 ? (
                <div className="drawer-empty">
                  <div className="drawer-empty-icon">
                    <ShoppingBag size={36} />
                  </div>
                  <h4>{t('cart.empty')}</h4>
                  <p>{t('cart.empty_desc')}</p>
                  <button className="drawer-empty-btn" onClick={onClose}>
                    {t('cart.browse')}
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {cartItems.map(item => (
                    <motion.div
                      key={item.id}
                      className="cart-item"
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="cart-item-img">
                        <img
                          src={item.image}
                          alt={typeof item?.name === 'object' ? (item.name[i18n.resolvedLanguage || 'en'] || item.name.en) : item?.name}
                          onError={e => { e.target.src = 'https://placehold.co/80x80/FFF3EE/FF5722?text=S'; }}
                        />
                      </div>

                      <div className="cart-item-info">
                        <div className="cart-item-category">{typeof item?.category === 'object' ? (item.category[i18n.resolvedLanguage || 'en'] || item.category.en) : item?.category}</div>
                        <div className="cart-item-name">{typeof item?.name === 'object' ? (item.name[i18n.resolvedLanguage || 'en'] || item.name.en) : item?.name}</div>
                        <div className="cart-item-bottom">
                          <div className="cart-item-price">
                            <span>RWF </span>
                            {(item.price * item.qty).toLocaleString()}
                          </div>
                          <div className="qty-controls">
                            <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.qty - 1)}>
                              <Minus size={12} />
                            </button>
                            <div className="qty-value">{item.qty}</div>
                            <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.qty + 1)}>
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <button className="cart-item-remove" onClick={() => onRemove(item.id)} title="Remove">
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="drawer-footer">
                {/* Delivery / Pickup toggle */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  {['Delivery', 'Pickup'].map(type => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      style={{
                        flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                        background: orderType === type ? '#FFF3EE' : 'white',
                        color: orderType === type ? '#FF5722' : '#7B7B8D',
                        border: `1px solid ${orderType === type ? '#FF5722' : '#F0F0F5'}`,
                        transition: 'all 0.2s', cursor: 'pointer',
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Branch selector */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    fontSize: 12, fontWeight: 700, color: '#7B7B8D',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    marginBottom: 8,
                  }}>
                    {orderType === 'Pickup' ? <Store size={13} /> : <MapPin size={13} />}
                    {orderType === 'Pickup' ? t('cart.pickup_branch') : t('cart.nearest_branch')}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <MapPin
                      size={15}
                      style={{
                        position: 'absolute', left: 12, top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#FF5722', pointerEvents: 'none',
                      }}
                    />
                    <select
                      value={selectedBranch?.id || ''}
                      onChange={e => {
                        const branch = SIMBA_BRANCHES.find(b => b.id === e.target.value);
                        if (branch) setSelectedBranch(branch);
                      }}
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 34px',
                        borderRadius: 10,
                        border: '1.5px solid #FFE0B2',
                        background: '#FFFAF8',
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#1A1A2E',
                        outline: 'none',
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23FF5722' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                      }}
                    >
                      {SIMBA_BRANCHES.map(branch => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Toggle map button */}
                  <button
                    onClick={() => setShowMap(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      marginTop: 8, width: '100%',
                      padding: '7px 12px', borderRadius: 8,
                      border: `1.5px solid ${showMap ? '#FF5722' : '#F0F0F5'}`,
                      background: showMap ? '#FFF3EE' : 'transparent',
                      fontSize: 12, fontWeight: 700,
                      color: showMap ? '#FF5722' : '#7B7B8D',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <Map size={13} />
                    {showMap ? t('cart.hide_map') : t('cart.view_map')}
                    {showMap ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>

                {/* Branch map — lazy-loaded */}
                <AnimatePresence>
                  {showMap && (
                    <motion.div
                      key="branch-map"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden', marginBottom: 14 }}
                    >
                      <Suspense fallback={
                        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFAF8', borderRadius: 10, border: '1.5px solid #FFE0B2', fontSize: 13, color: '#aaa' }}>
                          Loading map…
                        </div>
                      }>
                        <BranchMap
                          selectedBranch={selectedBranch}
                          onSelectBranch={(branch) => {
                            setSelectedBranch(branch);
                          }}
                        />
                      </Suspense>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Summary */}
                <div className="cart-summary">
                  <div className="cart-summary-row">
                    <span>{t('cart.subtotal')} ({totalItems} {totalItems !== 1 ? 'items' : 'item'})</span>
                    <span>RWF {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>{deliveryFee > 0 ? t('cart.delivery') : t('cart.delivery_free')}</span>
                    <span>RWF {deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="cart-summary-row total">
                    <span>{t('cart.total')}</span>
                    <span>RWF {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout button — shows login prompt if not logged in */}
                {user ? (
                  <button className="btn-checkout" id="btn-place-order" onClick={onCheckout}>
                    <ShoppingCart size={18} />
                    {t('cart.place_order')}
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <div>
                    <div style={{
                      background: '#FFF3EE',
                      border: '1px dashed #FFCCBC',
                      borderRadius: 12,
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 12,
                      fontSize: 13,
                      color: '#7B7B8D',
                    }}>
                      <LogIn size={18} color="#FF5722" style={{ flexShrink: 0 }} />
                      <span>
                        <strong style={{ color: '#1A1A2E' }}>{t('cart.signin_prompt_1')}</strong>{t('cart.signin_prompt_2')}
                      </span>
                    </div>
                    <button className="btn-checkout" id="btn-signin-place-order" onClick={onCheckout}>
                      <LogIn size={18} />
                      {t('cart.signin_place_order')}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                <button className="btn-clear-cart" id="btn-clear-cart" onClick={onClear}>
                  <Trash2 size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  {t('cart.clear')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
