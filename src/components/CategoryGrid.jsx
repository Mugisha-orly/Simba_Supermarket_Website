import React from 'react';

const CategoryTicker = ({ categories, activeCategory, onCategorySelect }) => {
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
            <div className="section-label">Shop by Department</div>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Browse <span>Categories</span>
            </h2>
          </div>
          <button className="categories-view-all" onClick={() => onCategorySelect('All')}>
            View All
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
