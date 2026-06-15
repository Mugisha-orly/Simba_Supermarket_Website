import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Eye, EyeOff, ShoppingBag, CheckCircle, ArrowRight, MapPin } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';

const AuthModal = ({ isOpen, onClose, onAuthSuccess, cartItems, skipToSuccess = false, user, orderType, selectedBranch }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(() => skipToSuccess ? 'success' : 'login');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  React.useEffect(() => {
    if (isOpen && skipToSuccess) {
      setTab('success');
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: ['#FF5722', '#FF9800', '#FFFFFF', '#22c55e'] });
      setTimeout(() => { onAuthSuccess(user, null); }, 2400);
    } else if (isOpen && !skipToSuccess) {
      setTab('login');
      setError('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, skipToSuccess]);

  const orderTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0) + (orderType === 'Delivery' ? 2000 : 0);

  const finishAuth = (userData, token) => {
    setLoading(false);
    setTab('success');
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: ['#FF5722', '#FF9800', '#FFFFFF', '#22c55e'] });
    setTimeout(() => { onAuthSuccess(userData, token); }, 2400);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Google sign-in failed');
      finishAuth(data.user, data.token);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Google sign-in failed. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) { setError('Please fill in all fields.'); return; }
    if (!/\S+@\S+\.\S+/.test(loginForm.email)) { setError('Please enter a valid email.'); return; }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      finishAuth(data.user, data.token);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.password) { setError('Please fill in all fields.'); return; }
    if (!/\S+@\S+\.\S+/.test(registerForm.email)) { setError('Please enter a valid email.'); return; }
    if (registerForm.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (registerForm.password !== registerForm.confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: registerForm.name, email: registerForm.email, password: registerForm.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      finishAuth(data.user, data.token);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 16px 13px 46px',
    borderRadius: 12,
    border: '2px solid #F0F0F5',
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: '#FFFAF8',
    color: '#2C2C3E',
  };

  const iconWrapStyle = {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#aaa',
    pointerEvents: 'none',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={tab !== 'success' ? onClose : undefined}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(26, 26, 46, 0.65)',
              backdropFilter: 'blur(6px)',
              zIndex: 600,
            }}
          />

          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 601,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            pointerEvents: 'none',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              style={{
                width: '100%',
                maxWidth: 460,
                background: 'white',
                borderRadius: 28,
                boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
                overflow: 'hidden',
                pointerEvents: 'all',
              }}
            >

            {tab === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ padding: '56px 40px', textAlign: 'center' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', damping: 15, stiffness: 200 }}
                  style={{
                    width: 88, height: 88,
                    borderRadius: 28,
                    background: 'linear-gradient(135deg, #FF5722, #FF9800)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 12px 40px rgba(255,87,34,0.35)',
                  }}
                >
                  <CheckCircle size={44} color="white" strokeWidth={2.5} />
                </motion.div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 900, color: '#1A1A2E', marginBottom: 10 }}>
                  Order Confirmed! 🎉
                </h3>
                <p style={{ fontSize: 15, color: '#7B7B8D', lineHeight: 1.6, marginBottom: 20 }}>
                  {(user || {}).name ? `Welcome, ${(user || {}).name.split(' ')[0]}! Your` : 'Your'} order of{' '}
                  <strong style={{ color: '#FF5722' }}>{cartItems.reduce((s, i) => s + i.qty, 0)} items</strong>{' '}
                  worth <strong style={{ color: '#1A1A2E' }}>RWF {orderTotal.toLocaleString()}</strong> has been placed successfully.
                </p>
                <div style={{
                  background: '#FFF3EE', borderRadius: 16,
                  padding: '16px 20px',
                  border: '1px solid #FFCCBC',
                  marginBottom: 8,
                  textAlign: 'left',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <ShoppingBag size={22} color="#FF5722" style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E' }}>
                        {orderType === 'Delivery' ? 'Our team will contact you shortly' : 'Your order is being prepared'}
                      </div>
                      <div style={{ fontSize: 12, color: '#7B7B8D', marginTop: 2 }}>
                        {orderType === 'Delivery'
                          ? 'Expected delivery: within 60 minutes in Kigali'
                          : 'Expected pickup: ready in 30 minutes at our store'}
                      </div>
                    </div>
                  </div>
                  {selectedBranch && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      marginTop: 12, paddingTop: 10,
                      borderTop: '1px solid #FFCCBC',
                      fontSize: 12, fontWeight: 700, color: '#FF5722',
                    }}>
                      <MapPin size={13} />
                      {orderType === 'Pickup' ? 'Pickup from: ' : 'Branch: '}
                      <span style={{ color: '#1A1A2E', fontWeight: 600 }}>{selectedBranch.name}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <>
                <div style={{
                  background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
                  padding: '28px 32px 24px',
                  position: 'relative',
                }}>
                  <button
                    onClick={onClose}
                    style={{
                      position: 'absolute', top: 16, right: 16,
                      width: 36, height: 36, borderRadius: 10,
                      background: 'rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'rgba(255,255,255,0.7)', transition: 'all 0.2s',
                    }}
                  >
                    <X size={18} />
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 14,
                      background: 'rgba(255,87,34,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <ShoppingBag size={22} color="#FF5722" />
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        {t('auth.secure')}
                      </div>
                      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800, color: 'white' }}>
                        {t('auth.title')}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: 12, padding: '10px 14px',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                        {cartItems.reduce((s, i) => s + i.qty, 0)} items · {orderType}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#FF9800', fontFamily: 'Outfit, sans-serif' }}>
                        RWF {orderTotal.toLocaleString()}
                      </span>
                    </div>
                    {selectedBranch && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                        <MapPin size={11} />
                        {selectedBranch.name}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', borderBottom: '1px solid #F0F0F5' }}>
                  {['login', 'register'].map(t_key => (
                    <button
                      key={t_key}
                      onClick={() => { setTab(t_key); setError(''); }}
                      style={{
                        flex: 1, padding: '14px', fontSize: 13,
                        fontWeight: 700, fontFamily: 'Inter, sans-serif',
                        color: tab === t_key ? '#FF5722' : '#7B7B8D',
                        borderBottom: tab === t_key ? '2px solid #FF5722' : '2px solid transparent',
                        marginBottom: -1, transition: 'all 0.2s',
                        textTransform: 'capitalize', letterSpacing: '0.03em',
                      }}
                    >
                      {t_key === 'login' ? t('auth.login') : t('auth.create')}
                    </button>
                  ))}
                </div>

                <div style={{ padding: '28px 32px 32px' }}>
                  {error && (
                    <div style={{
                      background: '#FEF2F2', border: '1px solid #FECACA',
                      borderRadius: 10, padding: '10px 14px',
                      fontSize: 13, color: '#EF4444', fontWeight: 600,
                      marginBottom: 16,
                    }}>
                      ⚠ {error}
                    </div>
                  )}

                  <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', marginBottom: 20 }}>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Login Failed')}
                        useOneTap
                        theme="filled_blue"
                        shape="pill"
                        width="100%"
                        text={tab === 'login' ? 'signin_with' : 'signup_with'}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 12 }}>
                      <div style={{ flex: 1, height: 1, background: '#F0F0F5' }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('auth.or')}</span>
                      <div style={{ flex: 1, height: 1, background: '#F0F0F5' }} />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {tab === 'login' ? (
                      <motion.form
                        key="login"
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleLogin}
                        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                      >
                        <div style={{ position: 'relative' }}>
                          <span style={iconWrapStyle}><Mail size={16} /></span>
                          <input
                            type="email"
                            placeholder={t('auth.email')}
                            style={inputStyle}
                            value={loginForm.email}
                            onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                            onFocus={e => { e.target.style.borderColor = '#FF5722'; e.target.style.background = 'white'; }}
                            onBlur={e => { e.target.style.borderColor = '#F0F0F5'; e.target.style.background = '#FFFAF8'; }}
                          />
                        </div>

                        <div style={{ position: 'relative' }}>
                          <span style={iconWrapStyle}><Lock size={16} /></span>
                          <input
                            type={showPass ? 'text' : 'password'}
                            placeholder={t('auth.password')}
                            style={{ ...inputStyle, paddingRight: 46 }}
                            value={loginForm.password}
                            onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                            onFocus={e => { e.target.style.borderColor = '#FF5722'; e.target.style.background = 'white'; }}
                            onBlur={e => { e.target.style.borderColor = '#F0F0F5'; e.target.style.background = '#FFFAF8'; }}
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)}
                            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}>
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        <div style={{ textAlign: 'right', marginTop: -8 }}>
                          <button type="button" style={{ fontSize: 12, color: '#FF5722', fontWeight: 600 }}>
                            {t('auth.forgot')}
                          </button>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          style={{
                            background: loading ? '#ccc' : 'linear-gradient(135deg, #FF5722, #E64A19)',
                            color: 'white', padding: '15px', borderRadius: 14,
                            fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                            letterSpacing: '0.05em', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', gap: 10,
                            boxShadow: loading ? 'none' : '0 8px 24px rgba(255,87,34,0.35)',
                            transition: 'all 0.3s', cursor: loading ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {loading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                              style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                            />
                          ) : (
                            <> {t('auth.login')} & Place Order <ArrowRight size={18} /> </>
                          )}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: 13, color: '#7B7B8D' }}>
                          Don&apos;t have an account?{' '}
                          <button type="button" onClick={() => { setTab('register'); setError(''); }}
                            style={{ color: '#FF5722', fontWeight: 700 }}>
                            {t('auth.create')} free
                          </button>
                        </p>
                      </motion.form>
                    ) : (
                      <motion.form
                        key="register"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleRegister}
                        style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                      >
                        <div style={{ position: 'relative' }}>
                          <span style={iconWrapStyle}><User size={16} /></span>
                          <input
                            type="text"
                            placeholder="Full name"
                            style={inputStyle}
                            value={registerForm.name}
                            onChange={e => setRegisterForm(p => ({ ...p, name: e.target.value }))}
                            onFocus={e => { e.target.style.borderColor = '#FF5722'; e.target.style.background = 'white'; }}
                            onBlur={e => { e.target.style.borderColor = '#F0F0F5'; e.target.style.background = '#FFFAF8'; }}
                          />
                        </div>

                        <div style={{ position: 'relative' }}>
                          <span style={iconWrapStyle}><Mail size={16} /></span>
                          <input
                            type="email"
                            placeholder={t('auth.email')}
                            style={inputStyle}
                            value={registerForm.email}
                            onChange={e => setRegisterForm(p => ({ ...p, email: e.target.value }))}
                            onFocus={e => { e.target.style.borderColor = '#FF5722'; e.target.style.background = 'white'; }}
                            onBlur={e => { e.target.style.borderColor = '#F0F0F5'; e.target.style.background = '#FFFAF8'; }}
                          />
                        </div>

                        <div style={{ position: 'relative' }}>
                          <span style={iconWrapStyle}><Lock size={16} /></span>
                          <input
                            type={showPass ? 'text' : 'password'}
                            placeholder={t('auth.password')}
                            style={{ ...inputStyle, paddingRight: 46 }}
                            value={registerForm.password}
                            onChange={e => setRegisterForm(p => ({ ...p, password: e.target.value }))}
                            onFocus={e => { e.target.style.borderColor = '#FF5722'; e.target.style.background = 'white'; }}
                            onBlur={e => { e.target.style.borderColor = '#F0F0F5'; e.target.style.background = '#FFFAF8'; }}
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)}
                            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}>
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        <div style={{ position: 'relative' }}>
                          <span style={iconWrapStyle}><Lock size={16} /></span>
                          <input
                            type={showConfirmPass ? 'text' : 'password'}
                            placeholder="Confirm password"
                            style={{ ...inputStyle, paddingRight: 46 }}
                            value={registerForm.confirmPassword}
                            onChange={e => setRegisterForm(p => ({ ...p, confirmPassword: e.target.value }))}
                            onFocus={e => { e.target.style.borderColor = '#FF5722'; e.target.style.background = 'white'; }}
                            onBlur={e => { e.target.style.borderColor = '#F0F0F5'; e.target.style.background = '#FFFAF8'; }}
                          />
                          <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}>
                            {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          style={{
                            background: loading ? '#ccc' : 'linear-gradient(135deg, #FF5722, #E64A19)',
                            color: 'white', padding: '15px', borderRadius: 14,
                            fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                            letterSpacing: '0.05em', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', gap: 10,
                            boxShadow: loading ? 'none' : '0 8px 24px rgba(255,87,34,0.35)',
                            transition: 'all 0.3s', cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: 4,
                          }}
                        >
                          {loading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                              style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                            />
                          ) : (
                            <> {t('auth.create')} & Order <ArrowRight size={18} /> </>
                          )}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>
                          By creating an account you agree to our{' '}
                          <span style={{ color: '#FF5722', fontWeight: 600 }}>Terms of Service</span> and{' '}
                          <span style={{ color: '#FF5722', fontWeight: 600 }}>Privacy Policy</span>.
                        </p>

                        <p style={{ textAlign: 'center', fontSize: 13, color: '#7B7B8D' }}>
                          Already have an account?{' '}
                          <button type="button" onClick={() => { setTab('login'); setError(''); }}
                            style={{ color: '#FF5722', fontWeight: 700 }}>
                            {t('auth.login')}
                          </button>
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
