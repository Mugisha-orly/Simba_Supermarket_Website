import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Minus, Plus, ArrowRight, ShoppingBag, User, LogIn } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQty, onRemove, onClear, onCheckout, user }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal > 0 ? 2000 : 0;
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
                My Cart
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
                    Signed in as {user.name}
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
                  <h4>Your cart is empty</h4>
                  <p>Add items from our catalogue to get started with your order.</p>
                  <button className="drawer-empty-btn" onClick={onClose}>
                    Browse Products
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
                          alt={item.name}
                          onError={e => { e.target.src = 'https://placehold.co/80x80/FFF3EE/FF5722?text=S'; }}
                        />
                      </div>

                      <div className="cart-item-info">
                        <div className="cart-item-category">{item.category}</div>
                        <div className="cart-item-name">{item.name}</div>
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
                {/* Summary */}
                <div className="cart-summary">
                  <div className="cart-summary-row">
                    <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                    <span>RWF {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>Delivery (Kigali)</span>
                    <span>RWF {deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="cart-summary-row total">
                    <span>Total</span>
                    <span>RWF {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout button — shows login prompt if not logged in */}
                {user ? (
                  <button className="btn-checkout" onClick={onCheckout}>
                    <ShoppingCart size={18} />
                    Place Order
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
                        <strong style={{ color: '#1A1A2E' }}>Sign in</strong> to place your order and save your information.
                      </span>
                    </div>
                    <button className="btn-checkout" onClick={onCheckout}>
                      <LogIn size={18} />
                      Sign In & Place Order
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                <button className="btn-clear-cart" onClick={onClear}>
                  <Trash2 size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Clear Cart
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
