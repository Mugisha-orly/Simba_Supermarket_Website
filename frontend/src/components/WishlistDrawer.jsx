import React from 'react';
import { useTranslation } from 'react-i18next';
// from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';

const WishlistDrawer = ({ isOpen, onClose, wishlistItems, onRemove, onAddToCart }) => {
  const { t, i18n } = useTranslation();
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
                <Heart size={20} color="#FF5722" fill="#FF5722" />
                {t('wishlist.title')}
                {wishlistItems.length > 0 && (
                  <span className="drawer-title-count">{wishlistItems.length}</span>
                )}
              </div>
              <button className="drawer-close" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="drawer-body">
              {wishlistItems.length === 0 ? (
                <div className="drawer-empty">
                  <div className="drawer-empty-icon">
                    <Heart size={36} />
                  </div>
                  <h4>{t('wishlist.empty')}</h4>
                  <p>{t('wishlist.empty_desc')}</p>
                  <button className="drawer-empty-btn" onClick={onClose}>
                    {t('wishlist.explore')}
                  </button>
                </div>
              ) : (
                wishlistItems.map(item => (
                  <motion.div
                    key={item.id}
                    className="wishlist-item"
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  >
                    <div className="wishlist-item-img">
                      <img
                        src={item.image}
                        alt={typeof item?.name === 'object' ? (item.name[i18n.resolvedLanguage || 'en'] || item.name.en) : item?.name}
                        onError={e => { e.target.src = 'https://placehold.co/80x80/FFF3EE/FF5722?text=S'; }}
                      />
                    </div>

                    <div className="wishlist-item-info">
                      <div className="wishlist-item-name">{typeof item?.name === 'object' ? (item.name[i18n.resolvedLanguage || 'en'] || item.name.en) : item?.name}</div>
                      <div className="wishlist-item-price">
                        <small>RWF </small>
                        {(item.price || 0).toLocaleString()}
                      </div>
                      <div className="wishlist-item-actions">
                        <button
                          className="btn-add-from-wishlist"
                          onClick={() => {
                            onAddToCart(item);
                            onRemove(item.id);
                          }}
                        >
                          <ShoppingCart size={13} />
                          {t('wishlist.add_cart')}
                        </button>
                        <button
                          className="btn-remove-wishlist"
                          onClick={() => onRemove(item.id)}
                          title="Remove from wishlist"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {wishlistItems.length > 0 && (
              <div className="drawer-footer">
                <button
                  className="btn-checkout"
                  onClick={() => {
                    wishlistItems.forEach(item => onAddToCart(item));
                    wishlistItems.forEach(item => onRemove(item.id));
                    onClose();
                  }}
                >
                  <ShoppingCart size={18} />
                  {t('wishlist.add_all')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistDrawer;
