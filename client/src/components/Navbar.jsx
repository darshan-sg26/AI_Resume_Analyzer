import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        borderBottom: '1px solid var(--glass-border)',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
        <BrainCircuit size={28} color="var(--color-primary)" />
        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>
          Interview<span className="gradient-text">AI</span>
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={{ fontWeight: 500, color: 'var(--color-text-muted)' }}>Dashboard</Link>
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', 
                  background: 'var(--color-surface)', padding: '0.5rem 1rem', 
                  borderRadius: '20px', cursor: 'pointer', border: '1px solid var(--glass-border)',
                  color: 'var(--color-text)'
                }}
              >
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%', 
                  background: 'var(--color-primary)', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', 
                  color: 'white', fontWeight: 'bold', fontSize: '12px'
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user?.name}</span>
                <ChevronDown size={16} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                      width: '200px', background: 'rgba(15, 23, 42, 0.95)',
                      backdropFilter: 'blur(16px)',
                      borderRadius: '12px', border: '1px solid var(--glass-border)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)', overflow: 'hidden', zIndex: 100
                    }}
                  >
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)' }}>{user?.name}</p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                      <Link 
                        to="/profile" 
                        onClick={() => setIsDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '8px', color: 'var(--color-text)', textDecoration: 'none' }}
                      >
                        <UserIcon size={16} /> My Profile
                      </Link>
                      <button 
                        onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', width: '100%', textAlign: 'left', borderRadius: '8px', color: 'var(--color-error)', background: 'transparent' }}
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-secondary">Log In</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
