import React from 'react';
import { Package, ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomerDashboard = ({ orders, onBackToStore }) => {
  return (
    <div style={{ padding: '40px 20px', minHeight: 'calc(100vh - 140px)', background: '#FFFAF8' }}>
      <div className="container" style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        <button 
          onClick={onBackToStore}
          style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#FF5722', fontWeight: 700, marginBottom: 24, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft size={18} />
          Back to Store
        </button>

        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--dark)', marginBottom: 8 }}>My Orders</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: 30 }}>Track your recent orders and their status.</p>

        {orders.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 20, padding: 40, textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <Package size={48} color="#FFCCBC" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>No orders yet</h3>
            <p style={{ color: 'var(--text-light)' }}>You haven't placed any orders yet. Start shopping!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  background: 'white', borderRadius: 20, padding: 24, 
                  boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #F0F0F5', paddingBottom: 16, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 600, marginBottom: 4 }}>Order #{order.id}</div>
                    <div style={{ fontSize: 13, color: '#aaa', marginBottom: 4 }}>{new Date(order.date).toLocaleString()}</div>
                    {order.branch && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#FF5722' }}>
                        📍 {order.branch.name}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>{order.total.toLocaleString()} RWF</div>
                    <div style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 600 }}>{order.type || 'Delivery'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>Items:</h4>
                    {order.items.map(i => (
                      <div key={i.id} style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 4 }}>
                        {i.qty}x {typeof i.name === 'object' ? (i.name.en || i.name.fr) : i.name}
                      </div>
                    ))}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: order.status === 'Completed' || order.status === 'Delivered' ? '#F0FDF4' : '#FFF3EE',
                      color: order.status === 'Completed' || order.status === 'Delivered' ? '#16A34A' : 'var(--primary)',
                      padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700
                    }}>
                      {order.status === 'Completed' || order.status === 'Delivered' ? <CheckCircle size={16} /> : <Clock size={16} />}
                      {order.status}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
