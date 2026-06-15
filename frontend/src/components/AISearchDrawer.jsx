import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAIRecommendations } from '../utils/aiService';

const getBadge = (product) => {
  if (!product?.inStock) return { textKey: 'products.out_of_stock', type: 'out' };
  return null;
};

const AISearchDrawer = ({ isOpen, onClose, products = [], searchQuery = '', onAddToCart }) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        setMessages([
          {
            id: 'welcome',
            type: 'ai',
            text: t('ai.welcome', 'Hi! I am Simba AI. Tell me what you want to cook or buy, and I will find the right ingredients for you! ✨')
          }
        ]);
      }
      if (searchQuery && !input) {
        setInput(searchQuery);
      }
    }
  }, [isOpen, searchQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const aiResponse = await getAIRecommendations(userMsg, i18n.resolvedLanguage || 'en');
      
      // Filter products based on keywords
      const keywords = aiResponse.searchKeywords || [];
      const recommendedProducts = products.filter(p => {
        const nameEn = (p?.name?.en || p?.name || '').toLowerCase();
        const catEn = (p?.category?.en || p?.category || '').toLowerCase();
        return keywords.some(kw => {
          const lowerKw = kw.toLowerCase();
          return nameEn.includes(lowerKw) || catEn.includes(lowerKw);
        });
      }).slice(0, 5); // top 5 recommendations

      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          type: 'ai', 
          text: aiResponse.response,
          products: recommendedProducts
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          type: 'ai', 
          isError: true,
          text: t('ai.error', 'Oops, something went wrong. Did you configure the Gemini API key in the .env file?') 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Drawer Panel */}
          <motion.div
            className="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            style={{ width: 450, maxWidth: '90vw' }}
          >
            {/* Header */}
            <div className="drawer-header" style={{ background: '#FFF3EE', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--dark)' }}>Simba AI</h2>
                  <p style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>Smart Shopping Assistant</p>
                </div>
              </div>
              <button className="drawer-close" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {/* Chat History */}
            <div className="drawer-body" style={{ background: '#FFFAF8', padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {messages.map((msg) => (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '85%',
                      padding: '12px 16px',
                      borderRadius: '16px',
                      background: msg.type === 'user' ? 'var(--dark)' : (msg.isError ? '#FEF2F2' : 'white'),
                      color: msg.type === 'user' ? 'white' : (msg.isError ? '#991B1B' : 'var(--text)'),
                      boxShadow: msg.type === 'ai' && !msg.isError ? 'var(--shadow-sm)' : 'none',
                      border: msg.type === 'ai' ? (msg.isError ? '1px solid #FCA5A5' : '1px solid var(--border-light)') : 'none',
                      fontSize: 14,
                      lineHeight: 1.5,
                      borderBottomRightRadius: msg.type === 'user' ? 4 : 16,
                      borderBottomLeftRadius: msg.type === 'ai' ? 4 : 16,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8
                    }}>
                      {msg.isError && <AlertCircle size={18} style={{ color: '#DC2626', flexShrink: 0, marginTop: 2 }} />}
                      <div>{msg.text}</div>
                    </div>

                    {/* Render Recommended Products inline */}
                    {msg.products && msg.products.length > 0 && (
                      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                        {msg.products.map(product => {
                          const badge = getBadge(product);
                          return (
                            <div key={product.id} style={{
                              display: 'flex', alignItems: 'center', gap: 12, background: 'white', 
                              padding: 10, borderRadius: 12, border: '1px solid var(--border-light)',
                              boxShadow: 'var(--shadow-sm)'
                            }}>
                              <img src={product.image} alt="product" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)', lineHeight: 1.2 }}>
                                  {typeof product?.name === 'object' ? (product.name[i18n.resolvedLanguage || 'en'] || product.name.en) : product?.name}
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 800, marginTop: 4 }}>
                                  {product.price.toLocaleString()} RWF
                                </div>
                              </div>
                              <button 
                                onClick={() => onAddToCart(product)}
                                disabled={!!badge}
                                style={{ width: 36, height: 36, borderRadius: '50%', background: badge ? '#eee' : 'var(--orange-tint)', color: badge ? '#999' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <ShoppingCart size={16} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{
                      padding: '12px 16px', borderRadius: '16px', background: 'white', borderBottomLeftRadius: 4,
                      border: '1px solid var(--border-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 8
                    }}>
                      <Loader2 size={16} className="lucide-spin" style={{ animation: 'spin 1s linear infinite' }} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="drawer-footer" style={{ borderTop: '1px solid var(--border-light)', padding: 20 }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('ai.placeholder', 'E.g. Ingredients for a cake...')}
                  style={{
                    width: '100%', padding: '14px 48px 14px 16px', borderRadius: '14px',
                    border: '2px solid var(--border-light)', fontSize: 14, outline: 'none',
                    transition: 'var(--transition)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    width: 34, height: 34, borderRadius: 10, background: input.trim() && !isLoading ? 'var(--primary)' : '#eee',
                    color: input.trim() && !isLoading ? 'white' : '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'var(--transition)'
                  }}
                >
                  <Send size={16} style={{ marginLeft: -2 }} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Add a quick keyframes for loader
const style = document.createElement('style');
style.textContent = `
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(style);

export default AISearchDrawer;
