import React from 'react';
import { Package, ArrowLeft, Clock, CheckCircle, Truck, ShoppingBag, User, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const statusConfig = {
  Pending:   { icon: Clock,         color: '#FF9800', bg: '#FFF3E0', label_key: 'customer.status_pending' },
  Confirmed: { icon: CheckCircle,   color: '#3B82F6', bg: '#EFF6FF', label_key: 'customer.status_confirmed' },
  Delivered: { icon: Truck,         color: '#22c55e', bg: '#F0FDF4', label_key: 'customer.status_delivered' },
  Completed: { icon: CheckCircle,   color: '#22c55e', bg: '#F0FDF4', label_key: 'customer.status_completed' },
};

const CustomerDashboard = ({ orders, user, onBackToStore }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || 'en';

  return (
    <div style={{ padding: '40px 20px', minHeight: 'calc(100vh - 140px)', background: 'var(--bg)' }}>
      <div className="container" style={{ maxWidth: 1000, margin: '0 auto' }}>

        <button
          id="btn-back-to-store"
          onClick={onBackToStore}
          style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#FF5722', fontWeight: 700, marginBottom: 28, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
        >
          <ArrowLeft size={18} />
          {t('customer.back')}
        </button>

        {/* Profile banner */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(135deg, #1A1A2E, #2D2D44)',
              borderRadius: 20, padding: '24px 28px',
              marginBottom: 32, display: 'flex', alignItems: 'center', gap: 20,
              flexWrap: 'wrap',
            }}
          >
            {user.picture ? (
              <img src={user.picture} alt={user.name}
                style={{ width: 64, height: 64, borderRadius: 18, border: '3px solid #FF5722', flexShrink: 0 }} />
            ) : (
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: 'linear-gradient(135deg, #FF5722, #FF9800)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 900, color: 'white', flexShrink: 0,
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
                {t('customer.profile_title')}
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 4 }}>
                {user.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                <Mail size={12} />
                {user.email}
              </div>
            </div>
            <div style={{
              background: 'rgba(255,87,34,0.2)', borderRadius: 12, padding: '8px 16px',
              color: '#FF9800', fontSize: 12, fontWeight: 700, border: '1px solid rgba(255,87,34,0.3)',
            }}>
              {t('customer.profile_member')} · {user.role || 'Customer'}
            </div>
          </motion.div>
        )}

        {/* Orders header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 4, fontFamily: 'Outfit, sans-serif' }}>
            {t('customer.title')}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{t('customer.subtitle')}</p>
        </div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: 'var(--bg-card)', borderRadius: 20, padding: 48, textAlign: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}
          >
            <div style={{ width: 80, height: 80, borderRadius: 24, background: '#FFF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Package size={36} color="#FFCCBC" />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{t('customer.no_orders')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>{t('customer.no_orders_desc')}</p>
            <button
              onClick={onBackToStore}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #FF5722, #E64A19)',
                color: 'white', padding: '12px 28px', borderRadius: 12,
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(255,87,34,0.3)',
              }}
            >
              <ShoppingBag size={16} /> Start Shopping
            </button>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map((order, idx) => {
              const sc = statusConfig[order.status] || statusConfig.Pending;
              const StatusIcon = sc.icon;
              return (
                <motion.div
                  key={order.id}
                  id={`order-card-${order.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{
                    background: 'var(--bg-card)', borderRadius: 20, padding: 24,
                    boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid var(--border-light)', paddingBottom: 16, marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>
                        {t('customer.order_id', { id: order.id })}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                        {order.date ? new Date(order.date).toLocaleString() : ''}
                      </div>
                      {order.branch && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#FF5722' }}>
                          📍 {order.branch.name}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#FF5722', fontFamily: 'Outfit, sans-serif' }}>
                        RWF {(order.total || 0).toLocaleString()}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>{order.type || 'Delivery'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {t('customer.items_label')}
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {(order.items || []).map(i => (
                          <div key={i.id} style={{ fontSize: 13, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ background: '#FF5722', color: 'white', borderRadius: 6, padding: '2px 7px', fontSize: 11, fontWeight: 700 }}>{i.qty}×</span>
                            {typeof i.name === 'object' ? (i.name[lang] || i.name.en || '') : i.name}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: sc.bg,
                      color: sc.color,
                      padding: '10px 18px', borderRadius: 20, fontSize: 13, fontWeight: 700,
                      border: `1px solid ${sc.color}30`,
                      whiteSpace: 'nowrap',
                    }}>
                      <StatusIcon size={16} />
                      {t(sc.label_key)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
