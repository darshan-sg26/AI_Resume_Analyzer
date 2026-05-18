import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Award, Calendar, FileText, Target, CheckCircle, BrainCircuit } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useAnalysisStore from '../store/useAnalysisStore';

const Profile = () => {
  const { user } = useAuthStore();
  const { userStats, fetchUserStats, isFetchingStats } = useAnalysisStore();

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ maxWidth: '800px', margin: '2rem auto' }}
    >
      <motion.h1 variants={itemVariants} style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
        My Profile
      </motion.h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* User Info Card */}
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ 
            width: '120px', height: '120px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: 'white', fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {user?.name}
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            <Mail size={16} />
            <span>{user?.email}</span>
          </div>

          <div style={{ width: '100%', background: 'rgba(15, 23, 42, 0.4)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</p>
              <p style={{ fontWeight: 600, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center', marginTop: '0.25rem' }}>
                <CheckCircle size={14} /> Active
              </p>
            </div>
            <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member Since</p>
              <p style={{ fontWeight: 600, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}>
                <Calendar size={14} /> {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statistics Card */}
        <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', flex: 1 }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="var(--color-primary)" /> Activity Overview
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {isFetchingStats ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0', color: 'var(--color-primary)' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <BrainCircuit size={32} />
                  </motion.div>
                </div>
              ) : (
                <>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={16} /> Resumes Analyzed
                      </span>
                      <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{userStats?.totalAnalyses || 0}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${Math.min((userStats?.totalAnalyses || 0) * 10, 100)}%` }} transition={{ duration: 1, delay: 0.2 }}
                        style={{ height: '100%', background: 'var(--color-primary)', borderRadius: '4px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target size={16} /> Avg Match Score
                      </span>
                      <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{userStats?.averageMatchScore || 0}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${userStats?.averageMatchScore || 0}%` }} transition={{ duration: 1, delay: 0.4 }}
                        style={{ height: '100%', background: 'var(--color-secondary)', borderRadius: '4px' }}
                      />
                    </div>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic', lineHeight: 1.4 }}>
                      * The average ATS compatibility score across all your scanned resumes and job descriptions.
                    </p>
                  </div>
                </>
              )}
            </div>
            
            <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
              Keep up the great work! Your next job is just around the corner.
            </p>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
