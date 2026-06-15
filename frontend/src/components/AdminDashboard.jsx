import React, { useState } from 'react';
import { Package, ListOrdered, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = ({ orders, products, onToggleStock, updateOrderStatus, onBackToStore }) => {
  const [activeTab, setActiveTab] = useState('orders');

  const handleStockToggle = (productId, currentStock) => {
    onToggleStock(productId, currentStock);
  };

  return (
    <div style={{ padding: '40px 20px', minHeight: 'calc(100vh - 140px)', background: '#FFFAF8' }}>
      <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--dark)' }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-light)', marginTop: 8 }}>Manage store inventory and orders.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
          <button 
            onClick={() => setActiveTab('orders')}
            style={{ 
              padding: '12px 24px', 
              borderRadius: 12, 
              border: 'none',
              background: activeTab === 'orders' ? 'var(--primary)' : 'white',
              color: activeTab === 'orders' ? 'white' : 'var(--dark)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'var(--transition)'
            }}
          >
            <ListOrdered size={18} />
            Recent Orders
          </button>
          <button 
            onClick={() => setActiveTab('stock')}
            style={{ 
              padding: '12px 24px', 
              borderRadius: 12, 
              border: 'none',
              background: activeTab === 'stock' ? 'var(--primary)' : 'white',
              color: activeTab === 'stock' ? 'white' : 'var(--dark)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'var(--transition)'
            }}
          >
            <Package size={18} />
            Stock Management
          </button>
        </div>

        <div style={{ background: 'white', borderRadius: 20, padding: 30, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, color: 'var(--dark)' }}>Recent Orders ({orders.length})</h2>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-light)' }}>
                  No orders yet.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #eee', color: 'var(--text-light)' }}>
                        <th style={{ padding: '12px 16px' }}>Order ID</th>
                        <th style={{ padding: '12px 16px' }}>Date</th>
                        <th style={{ padding: '12px 16px' }}>Customer</th>
                        <th style={{ padding: '12px 16px' }}>Items</th>
                        <th style={{ padding: '12px 16px' }}>Branch</th>
                        <th style={{ padding: '12px 16px' }}>Type</th>
                        <th style={{ padding: '12px 16px' }}>Total</th>
                        <th style={{ padding: '12px 16px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '16px', fontWeight: 600 }}>{order.id}</td>
                          <td style={{ padding: '16px', color: 'var(--text-light)' }}>{new Date(order.date).toLocaleString()}</td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ fontWeight: 600 }}>{order.customer.name}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-light)' }}>{order.customer.email}</div>
                          </td>
                          <td style={{ padding: '16px' }}>
                            {order.items.map(i => (
                              <div key={i.id} style={{ fontSize: 13 }}>{i.qty}x {typeof i.name === 'object' ? i.name.en : i.name}</div>
                            ))}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                              📍 {order.branch?.name || '—'}
                            </div>
                          </td>
                          <td style={{ padding: '16px', fontWeight: 600 }}>
                            {order.type || 'Delivery'}
                          </td>
                          <td style={{ padding: '16px', fontWeight: 800, color: 'var(--primary)' }}>{order.total.toLocaleString()} RWF</td>
                          <td style={{ padding: '16px' }}>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              style={{ 
                                padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                                border: '1px solid #FFCCBC', background: '#FFF3EE', color: 'var(--primary)',
                                outline: 'none', cursor: 'pointer'
                              }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Ready for Pickup">Ready for Pickup</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'stock' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, color: 'var(--dark)' }}>Products Inventory</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #eee', color: 'var(--text-light)' }}>
                      <th style={{ padding: '12px 16px' }}>Product</th>
                      <th style={{ padding: '12px 16px' }}>Category</th>
                      <th style={{ padding: '12px 16px' }}>Price</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img src={product.image} alt="product" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} />
                          <div style={{ fontWeight: 600 }}>{typeof product.name === 'object' ? product.name.en : product.name}</div>
                        </td>
                        <td style={{ padding: '16px', color: 'var(--text-light)' }}>
                          {typeof product.category === 'object' ? product.category.en : product.category}
                        </td>
                        <td style={{ padding: '16px', fontWeight: 600 }}>{product.price.toLocaleString()} RWF</td>
                        <td style={{ padding: '16px' }}>
                          {product.inStock ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#16A34A', fontSize: 14, fontWeight: 600 }}>
                              <CheckCircle size={16} /> In Stock
                            </span>
                          ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#DC2626', fontSize: 14, fontWeight: 600 }}>
                              <XCircle size={16} /> Out of Stock
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleStockToggle(product.id, product.inStock)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 8,
                              border: 'none',
                              background: product.inStock ? '#FEF2F2' : '#F0FDF4',
                              color: product.inStock ? '#DC2626' : '#16A34A',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Mark {product.inStock ? 'Out of Stock' : 'In Stock'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
