import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Target, CheckCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '4rem' }}
    >
      <motion.h1 variants={itemVariants} style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.5rem', maxWidth: '800px' }}>
        Acing your next interview just got <span className="gradient-text">effortless.</span>
      </motion.h1>
      
      <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '3rem', maxWidth: '600px' }}>
        Upload your resume and the job description. Our AI analyzes the match, detects skill gaps, and prepares custom technical and behavioral questions just for you.
      </motion.p>
      
      <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', marginBottom: '5rem' }}>
        <Link to={isAuthenticated ? "/dashboard" : "/register"} className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
          {isAuthenticated ? 'Go to Dashboard' : 'Start Preparing Now'}
        </Link>
      </motion.div>

      <motion.div variants={containerVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%' }}>
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '1rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem' }}>
            <FileText size={32} color="var(--color-primary)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>ATS-Optimized Resume</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Generate a perfectly tailored PDF resume in seconds that highlights the exact skills the job demands.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
          <div style={{ background: 'rgba(236, 72, 153, 0.2)', padding: '1rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem' }}>
            <Target size={32} color="var(--color-secondary)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Skill Gap Detection</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Know exactly what you're missing before the interview so you can prepare effectively.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem' }}>
            <CheckCircle size={32} color="var(--color-success)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Custom Questions</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Practice with behavioral and technical questions generated specifically for your background and target role.</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
