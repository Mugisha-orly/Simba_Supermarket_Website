import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Import images for the slideshow
import slide1 from '../assets/Simba_image_1.jpg';
import slide2 from '../assets/simba_image_2.jpg';
import slide3 from '../assets/simba_image_3.jpg';
import slide4 from '../assets/simba_image_4.jpg';

const images = [slide1, slide2, slide3, slide4];

const Hero = ({ onShopNow }) => {
  const { t } = useTranslation();
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-cycle images every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      <div className="hero-bg-shape" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-inner">
          {/* Content */}
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="hero-badge-dot" />
              {t('hero.badge')}
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {t('hero.title_part1')}<br />
              <span className="hero-title-accent">{t('hero.title_part2')}</span><br />
              {t('hero.title_accent')}.
            </motion.h1>

            <motion.p
              className="hero-desc"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {t('hero.desc')}
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button className="btn-hero-primary" onClick={onShopNow}>
                {t('hero.cta')}
                <ArrowRight size={18} />
              </button>

              {/* Stats row — visible immediately, proves localization */}
              <div className="hero-stats">
                <div className="hero-stat">
                  <h4>789+</h4>
                  <span>{t('hero.stat_products', 'Products')}</span>
                </div>
                <div className="hero-stat">
                  <h4>5</h4>
                  <span>{t('hero.stat_branches', 'Branches')}</span>
                </div>
                <div className="hero-stat">
                  <h4>50+</h4>
                  <span>{t('hero.stat_years', 'Years Serving Rwanda')}</span>
                </div>
                <div className="hero-stat">
                  <h4>100K+</h4>
                  <span>{t('hero.stat_customers', 'Happy Customers')}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual with Animated Slideshow */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="hero-img-wrapper">
              <AnimatePresence>
                <motion.img
                  key={currentIdx}
                  src={images[currentIdx]}
                  alt={`Simba Premium Selection ${currentIdx + 1}`}
                  className="hero-img"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </AnimatePresence>
              
              <div className="hero-img-overlay" />
              <div className="hero-img-caption">
                <div className="hero-img-caption-label">Summer Collection</div>
                <h3>Premium Delights</h3>
              </div>
              
              {/* Pagination Dots */}
              <div className="hero-slideshow-dots">
                {images.map((_, i) => (
                  <div 
                    key={i} 
                    className={`hero-dot ${i === currentIdx ? 'active' : ''}`}
                    onClick={() => setCurrentIdx(i)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
