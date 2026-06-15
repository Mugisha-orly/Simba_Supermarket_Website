import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, ArrowUpDown, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

const getBadge = (product) => {
  if (!product?.inStock) return { textKey: 'products.out_of_stock', type: 'out' };
  if ((product?.price || 0) > 100000) return { textKey: 'products.premium', type: 'premium' };
  if ((product?.id || 0) % 7 === 0) return { textKey: 'products.best_seller', type: 'bestseller' };
  if ((product?.id || 0) % 5 === 0) return { textKey: 'products.new', type: 'new' };
  return null;
};

export const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onClick }) => {
  const { t, i18n } = useTranslation();
  const [addedAnim, setAddedAnim] = useState(false);
  const badge = getBadge(product);

  const handleAdd = () => {
    if (!product?.inStock) return;
    onAddToCart(product);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1000);
    confetti({
      particleCount: 60,
      spread: 55,
      origin: { y: 0.75 },
      colors: ['#FF5722', '#FF9800', '#FFFFFF', '#FFE0B2'],
    });
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  return (
    <motion.div
      layout
      className="product-card"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
    >
      {/* Badge */}
      {badge && badge.type !== 'out' && (
        <div className={`product-badge ${badge.type}`}>{t(badge.textKey)}</div>
      )}

      {/* Wishlist button — always visible, filled when wishlisted */}
      <button
        className="product-wishlist-btn"
        onClick={handleWishlist}
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        style={{
          opacity: 1,
          color: isWishlisted ? '#FF5722' : undefined,
          background: isWishlisted ? '#FFF3EE' : undefined,
          borderColor: isWishlisted ? '#FFE0B2' : undefined,
        }}
      >
        <Heart
          size={15}
          fill={isWishlisted ? '#FF5722' : 'none'}
          color={isWishlisted ? '#FF5722' : '#ccc'}
        />
      </button>

      {/* Product image */}
      <div className="product-img-wrap">
        <img
          src={product?.image}
          alt={typeof product?.name === 'object' ? (product.name[i18n.resolvedLanguage || 'en'] || product.name.en) : product?.name}
          className="product-img"
          onError={e => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/300x300/FFF3EE/FF5722?text=Simba';
          }}
        />

      </div>

      {/* Info */}
      <div className="product-info">
        <div className="product-category">{typeof product?.category === 'object' ? (product.category[i18n.resolvedLanguage || 'en'] || product.category.en) : product?.category}</div>
        <div className="product-name">{typeof product?.name === 'object' ? (product.name[i18n.resolvedLanguage || 'en'] || product.name.en) : product?.name}</div>
        <div className="product-rating">
          <div className="product-stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < 4 ? 'currentColor' : 'none'}
                className={i < 4 ? 'product-star' : 'product-star empty'}
              />
            ))}
          </div>
          <span className="product-rating-text">(4.0)</span>
        </div>
      </div>

      {/* Footer */}
      <div className="product-footer">
        <div className="product-price">
          <span className="product-price-currency">RWF</span>
          <span className="product-price-amount">
            {(product?.price || 0).toLocaleString()}
          </span>
          {product?.inStock ? (
            <div className="product-stock">
              <div className="product-stock-dot" />
              {t('products.in_stock')}
            </div>
          ) : (
            <div style={{ fontSize: 10, color: '#EF4444', fontWeight: 700, marginTop: 2 }}>
              {t('products.out_of_stock')}
            </div>
          )}
        </div>

        <motion.button
          className="product-add-btn"
          onClick={(e) => { e.stopPropagation(); handleAdd(); }}
          disabled={!product?.inStock}
          whileTap={product?.inStock ? { scale: 0.88 } : {}}
          animate={addedAnim ? { scale: [1, 1.2, 1], backgroundColor: ['#FF5722', '#22c55e', '#FF5722'] } : {}}
          transition={{ duration: 0.4 }}
          title={t('products.add_to_cart')}
        >
          {addedAnim
            ? <span style={{ fontSize: 16 }}>✓</span>
            : <ShoppingCart size={18} />
          }
        </motion.button>
      </div>
    </motion.div>
  );
};

const SkeletonCard = () => (
  <div className="product-card" style={{ pointerEvents: 'none' }}>
    <div style={{ width: '100%', paddingTop: '75%', borderRadius: 12, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
    <div className="product-info" style={{ gap: 8 }}>
      <div style={{ height: 10, width: '50%', borderRadius: 6, background: '#f0f0f0' }} />
      <div style={{ height: 14, width: '80%', borderRadius: 6, background: '#e8e8e8' }} />
      <div style={{ height: 10, width: '40%', borderRadius: 6, background: '#f0f0f0' }} />
    </div>
    <div className="product-footer">
      <div style={{ height: 20, width: '45%', borderRadius: 6, background: '#f0f0f0' }} />
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0f0f0' }} />
    </div>
  </div>
);

const ProductGrid = ({ products, loading = false, onAddToCart, onToggleWishlist, wishlistIds = new Set(), sortBy, onSortChange, totalCount, onProductClick }) => {
  const { t, i18n } = useTranslation();
  const [displayCount, setDisplayCount] = useState(12);

  const visibleProducts = (products || []).slice(0, displayCount);

  return (
    <section className="products-section">
      <div className="container">
        {/* Header */}
        <div className="products-header">
          <div>
            <div className="section-label">{t('products.label')}</div>
            <h2 className="section-title">{t('products.title_part1')} <span>{t('products.title_accent')}</span></h2>
            <p className="products-count">
              {loading ? 'Loading products...' : t('products.showing', { displayed: Math.min(displayCount, totalCount), total: totalCount })}
            </p>
          </div>

          <div className="products-sort-wrapper">
            <ArrowUpDown size={14} color="#FF5722" />
            <span className="products-sort-label">{t('products.sort_by')}</span>
            <select
              className="products-sort-select"
              value={sortBy}
              onChange={e => onSortChange(e.target.value)}
            >
              <option value="Featured">{t('products.sort_featured')}</option>
              <option value="PriceLow">{t('products.sort_price_low')}</option>
              <option value="PriceHigh">{t('products.sort_price_high')}</option>
            </select>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <>
            <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
            <div className="products-grid">
              {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </>
        )}

        {/* Product grid + load more (hidden while loading) */}
        {!loading && (
          <>
            <div className="products-grid">
              <AnimatePresence mode="popLayout">
                {visibleProducts.length > 0 ? (
                  visibleProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={onAddToCart}
                      onToggleWishlist={onToggleWishlist}
                      isWishlisted={wishlistIds.has(product.id)}
                      onClick={() => onProductClick && onProductClick(product)}
                    />
                  ))
                ) : (
                  <motion.div
                    className="products-empty"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    key="empty"
                  >
                    <div style={{ fontSize: 64 }}>🔍</div>
                    <h3>{t('products.no_products')}</h3>
                    <p>{t('products.no_products_desc')}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {totalCount > displayCount && (
              <div className="load-more-wrap">
                <button
                  className="btn-load-more"
                  onClick={() => setDisplayCount(prev => prev + 12)}
                >
                  <TrendingUp size={18} />
                  {t('products.load_more')}
                </button>
                <div className="load-more-meta">
                  {t('products.load_meta', { displayed: Math.min(displayCount, totalCount), total: totalCount })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
