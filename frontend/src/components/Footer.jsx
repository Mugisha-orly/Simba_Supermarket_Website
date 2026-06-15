import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Phone, Bell, Send, Camera, Globe, MessageCircle } from 'lucide-react';

const SIMBA_LOGO = "https://scontent.fnbo1-1.fna.fbcdn.net/v/t39.30808-1/305616999_515241433938254_7819237593280698956_n.jpg?stp=dst-jpg_tt6&cstp=mx714x714&ctp=s714x714&_nc_cat=108&ccb=1-7&_nc_sid=3ab345&_nc_ohc=aE2Skg3MqGsQ7kNvwFUxMjI&_nc_oc=AdqQ7hHIbgJo2C98oI-bTyn_N9bh9q3wMLqXANgqx30DJhFr9Ic66FEZIY4WC-CPbNE3V7hvXD7kLsmPj0x6sikh&_nc_zt=24&_nc_ht=scontent.fnbo1-1.fna.fbcdn.net&_nc_gid=6cPx3AacY8Izepxx7UvAng&_nc_ss=7a389&oh=00_Af0k7mXZG_Kad_3bYd-alpTpzO8aEZvP0iAxaCgz0zKfXg&oe=69ED1DDC";

const Footer = () => {
  const { t } = useTranslation();
  const handleComingSoon = () => alert('This feature is coming soon!');

  const exploreLinks = [
    t('footer.explore_links.new_arrivals', 'New Arrivals'),
    t('footer.explore_links.featured_brands', 'Featured Brands'),
    t('footer.explore_links.fresh_produce', 'Fresh Produce'),
    t('footer.explore_links.daily_deals', 'Daily Deals'),
    t('footer.explore_links.simba_rewards', 'Simba Rewards')
  ];
  const serviceLinks = [
    t('footer.service_links.store_locator', 'Store Locator'),
    t('footer.service_links.track_order', 'Track Order'),
    t('footer.service_links.gift_vouchers', 'Gift Vouchers'),
    t('footer.service_links.business_accounts', 'Business Accounts'),
    t('footer.service_links.customer_support', 'Customer Support')
  ];
  const socialIcons = [Camera, Globe, MessageCircle];

  return (
    <footer className="footer">
      <div className="container">
        {/* Newsletter */}
        <motion.div
          className="footer-newsletter"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="newsletter-text">
            <div className="newsletter-tag">
              <Bell size={14} /> {t('footer.stay_updated')}
            </div>
            <h3 className="newsletter-title">
              {t('footer.title_part1')} <span>{t('footer.title_accent')}</span>
            </h3>
            <p className="newsletter-desc">
              {t('footer.desc')}
            </p>
          </div>

          <form
            className="newsletter-form"
            onSubmit={e => { e.preventDefault(); alert('Welcome to Simba Elite! 🎉'); }}
          >
            <input
              type="email"
              className="newsletter-input"
              placeholder={t('footer.placeholder')}
              required
            />
            <button type="submit" className="newsletter-btn">
              {t('footer.subscribe')} <Send size={15} />
            </button>
          </form>
        </motion.div>

        {/* Footer Grid */}
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand-logo">
              <img
                src={SIMBA_LOGO}
                alt="Simba"
                className="footer-brand-img"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div>
                <div className="footer-brand-title">SIMBA<span>.</span></div>
                <span className="footer-brand-sub">{t('footer.brand_sub')}</span>
              </div>
            </div>
            <p className="footer-desc">
              {t('footer.brand_desc')}
            </p>
            <div className="footer-socials">
              {socialIcons.map((Icon, i) => (
                <button key={i} className="footer-social-btn" onClick={handleComingSoon}>
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <div className="footer-col-title">{t('footer.explore')}</div>
            <div className="footer-links">
              {exploreLinks.map(link => (
                <button key={link} className="footer-link" onClick={handleComingSoon}>
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="footer-col-title">{t('footer.services')}</div>
            <div className="footer-links">
              {serviceLinks.map(link => (
                <button key={link} className="footer-link" onClick={handleComingSoon}>
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-col-title">{t('footer.find_us')}</div>
            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <MapPin size={18} />
              </div>
              <div>
                <div className="footer-contact-label">{t('footer.address_label')}</div>
                <div className="footer-contact-value">KN 82 St, Kigali, Rwanda</div>
              </div>
            </div>
            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <Phone size={18} />
              </div>
              <div>
                <div className="footer-contact-label">{t('footer.hotline_label')}</div>
                <div className="footer-contact-value">+250 788 300 000</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copy">
            {t('footer.rights')}
          </p>
          <div className="footer-payments">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              alt="Visa"
              className="footer-payment-logo"
            />
            <div className="footer-pay-divider" />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
              className="footer-payment-logo"
            />
            <div className="footer-pay-divider" />
            <span className="footer-momo">MTN MoMo</span>
          </div>
          <div className="footer-legal">
            <button className="footer-legal-link" onClick={handleComingSoon}>{t('footer.privacy')}</button>
            <button className="footer-legal-link" onClick={handleComingSoon}>{t('footer.terms')}</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
