import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, ArrowUpDown, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

const getBadge = (product) => {
  if (!product?.inStock) return { text: 'Out of Stock', type: 'out' };
  if ((product?.price || 0) > 100000) return { text: 'Premium', type: 'premium' };
  if ((product?.id || 0) % 7 === 0) return { text: 'Best Seller', type: 'bestseller' };
  if ((product?.id || 0) % 5 === 0) return { text: 'New', type: 'new' };
  return null;
};

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted }) => {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
    >
      {/* Badge */}
      {badge && badge.type !== 'out' && (
        <div className={`product-badge ${badge.type}`}>{badge.text}</div>
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
          alt={product?.name}
          className="product-img"
          onError={e => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/300x300/FFF3EE/FF5722?text=Simba';
          }}
        />

      </div>

      {/* Info */}
      <div className="product-info">
        <div className="product-category">{product?.category}</div>
        <div className="product-name">{product?.name}</div>
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
              In Stock
            </div>
          ) : (
            <div style={{ fontSize: 10, color: '#EF4444', fontWeight: 700, marginTop: 2 }}>
              Out of Stock
            </div>
          )}
        </div>

        <motion.button
          className="product-add-btn"
          onClick={handleAdd}
          disabled={!product?.inStock}
          whileTap={product?.inStock ? { scale: 0.88 } : {}}
          animate={addedAnim ? { scale: [1, 1.2, 1], backgroundColor: ['#FF5722', '#22c55e', '#FF5722'] } : {}}
          transition={{ duration: 0.4 }}
          title="Add to cart"
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

const ProductGrid = ({ products, onAddToCart, onToggleWishlist, wishlistIds = new Set(), sortBy, onSortChange, totalCount }) => {
  const [displayCount, setDisplayCount] = useState(12);

  const visibleProducts = (products || []).slice(0, displayCount);

  return (
    <section className="products-section">
      <div className="container">
        {/* Header */}
        <div className="products-header">
          <div>
            <div className="section-label">Our Catalogue</div>
            <h2 className="section-title">Curated <span>Selection</span></h2>
            <p className="products-count">
              Showing <strong>{Math.min(displayCount, totalCount)}</strong> of <strong>{totalCount}</strong> products
            </p>
          </div>

          <div className="products-sort-wrapper">
            <ArrowUpDown size={14} color="#FF5722" />
            <span className="products-sort-label">Sort by:</span>
            <select
              className="products-sort-select"
              value={sortBy}
              onChange={e => onSortChange(e.target.value)}
            >
              <option value="Featured">Featured</option>
              <option value="PriceLow">Price: Low to High</option>
              <option value="PriceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Grid */}
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
                <h3>No products found</h3>
                <p>Try adjusting your search or browsing a different category.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Load more */}
        {totalCount > displayCount && (
          <div className="load-more-wrap">
            <button
              className="btn-load-more"
              onClick={() => setDisplayCount(prev => prev + 12)}
            >
              <TrendingUp size={18} />
              Load More Products
            </button>
            <div className="load-more-meta">
              Showing {Math.min(displayCount, totalCount)} of {totalCount} items
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
