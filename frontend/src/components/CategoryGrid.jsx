import React from 'react';
import { useTranslation } from 'react-i18next';

const CategoryTicker = ({ categories, activeCategory, onCategorySelect }) => {
  const { t } = useTranslation();
  const cats = (categories || []).filter(c => c !== 'All');
  // Triple for a seamless seamless loop
  const tickerItems = [...cats, ...cats, ...cats];

  const handleClick = (cat) => {
    onCategorySelect(cat);
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="ticker-section">
      <div className="container">
        <div className="ticker-header">
          <div>
            <div className="section-label">{t('categories.label')}</div>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              {t('categories.title_part1')} <span>{t('categories.title_accent')}</span>
            </h2>
          </div>
          <button className="categories-view-all" onClick={() => onCategorySelect('All')}>
            {t('categories.view_all')}
          </button>
        </div>
      </div>

      {/* Single scrolling row with fade edges */}
      <div className="ticker-track-wrapper">
        <div className="ticker-track left">
          {tickerItems.map((cat, i) => (
            <button
              key={i}
              className={`ticker-pill${activeCategory === cat ? ' active' : ''}`}
              onClick={() => handleClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryTicker;
