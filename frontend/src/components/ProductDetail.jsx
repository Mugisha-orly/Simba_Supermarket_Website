import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Heart, Star, Minus, Plus, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProductCard } from './ProductGrid';

const ProductDetail = ({ product, products, onBack, onAddToCart, onToggleWishlist, wishlistIds, onProductClick }) => {
  const { t, i18n } = useTranslation();
  const [qty, setQty] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setQty(1);
  }, [product?.id]);

  if (!product) return null;

  const lang = i18n.resolvedLanguage || 'en';
  const name = typeof product.name === 'object' ? (product.name[lang] || product.name.en) : product.name;
  const category = typeof product.category === 'object' ? (product.category[lang] || product.category.en) : product.category;
  const isWishlisted = wishlistIds.has(product.id);

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(product, qty);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1000);
  };

  // Find related products (same category, different ID)
  const relatedProducts = products.filter(p => {
    const pCat = typeof p.category === 'object' ? (p.category[lang] || p.category.en) : p.category;
    return pCat === category && p.id !== product.id;
  }).slice(0, 4);

  return (
    <div className="product-detail-page">
      <div className="container">
        <button className="pd-back-btn" id="btn-back-to-products" onClick={onBack}>
          <ArrowLeft size={16} />
          {t('products.back')}
        </button>

        <div className="pd-layout">
          {/* Left: Image */}
          <div className="pd-image-section">
            <motion.div 
              className="pd-image-wrap"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <img 
                src={product.image} 
                alt={name} 
                className="pd-image"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/600x600/FFF3EE/FF5722?text=Simba';
                }}
              />
              <button 
                className="pd-wishlist-btn"
                onClick={() => onToggleWishlist(product)}
                style={{
                  color: isWishlisted ? '#FF5722' : '#7B7B8D',
                  background: isWishlisted ? '#FFF3EE' : 'white',
                  borderColor: isWishlisted ? '#FFE0B2' : '#F0F0F5',
                }}
              >
                <Heart size={20} fill={isWishlisted ? '#FF5722' : 'none'} />
              </button>
            </motion.div>
          </div>

          {/* Right: Info */}
          <div className="pd-info-section">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="pd-category">{category}</div>
              <h1 className="pd-title">{name}</h1>
              
              <div className="pd-rating">
                <div className="pd-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < 4 ? '#FF9800' : 'none'} color={i < 4 ? '#FF9800' : '#E5E5E5'} />
                  ))}
                </div>
                <span className="pd-rating-text">(4.0) - 120 Reviews</span>
              </div>

              <div className="pd-price-wrap">
                <div className="pd-price">
                  <span className="pd-currency">RWF</span>
                  <span className="pd-amount">{(product.price || 0).toLocaleString()}</span>
                </div>
                {product.inStock ? (
                  <div className="pd-stock in-stock">
                    <span className="pd-stock-dot" /> {t('products.in_stock')}
                  </div>
                ) : (
                  <div className="pd-stock out-stock">{t('products.out_of_stock')}</div>
                )}
              </div>

              <div className="pd-desc">
                Experience the premium quality of {name}. This item is highly rated by our customers and perfectly suited for your everyday needs. Enjoy the best quality guaranteed by Simba Supermarket.
              </div>

              <div className="pd-actions">
                <div className="pd-qty-selector">
                  <button className="pd-qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16} /></button>
                  <div className="pd-qty-val">{qty}</div>
                  <button className="pd-qty-btn" onClick={() => setQty(qty + 1)}><Plus size={16} /></button>
                </div>
                
                <motion.button 
                  className="pd-add-btn"
                  onClick={handleAdd}
                  disabled={!product.inStock}
                  whileTap={product.inStock ? { scale: 0.95 } : {}}
                  animate={addedAnim ? { scale: [1, 1.05, 1], backgroundColor: ['#FF5722', '#22c55e', '#FF5722'] } : {}}
                >
                  {addedAnim ? <span style={{ fontSize: 18, color: 'white' }}>✓ {t('products.add_to_cart')}</span> : <><ShoppingCart size={18} /> {t('products.add_to_cart')}</>}
                </motion.button>
              </div>

              <div className="pd-features">
                <div className="pd-feature">
                  <ShieldCheck size={20} className="pd-feature-icon" />
                  <div>
                    <h4>1 Year Warranty</h4>
                    <p>Guaranteed quality and support.</p>
                  </div>
                </div>
                <div className="pd-feature">
                  <Truck size={20} className="pd-feature-icon" />
                  <div>
                    <h4>Fast Delivery</h4>
                    <p>Delivered within 60 mins in Kigali.</p>
                  </div>
                </div>
                <div className="pd-feature">
                  <RotateCcw size={20} className="pd-feature-icon" />
                  <div>
                    <h4>Easy Returns</h4>
                    <p>Return within 7 days if unsatisfied.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Items */}
        {relatedProducts.length > 0 && (
          <div className="pd-related">
            <h2 className="pd-related-title">{t('products.related')}</h2>
            <div className="products-grid">
              {relatedProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={(prod) => onAddToCart(prod, 1)}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlistIds.has(p.id)}
                  onClick={() => {
                    onProductClick(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setQty(1);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
