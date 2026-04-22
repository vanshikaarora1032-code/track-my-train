import { motion } from 'framer-motion';
import { ArrowLeft, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlobeOrb from './GlobeOrb';

const AuthCard = ({ children, title, subtitle, showBack = true }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="auth-card relative"
    >
      <div className="flex justify-between items-center mb-2">
        {showBack ? (
          <button 
            onClick={() => navigate(-1)} 
            className="text-text-muted hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        ) : <div className="w-5" />}
        
        <Globe size={20} className="text-accent" />
      </div>

      <GlobeOrb />

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
        <p className="text-sm text-text-muted max-w-[280px] mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {children}
    </motion.div>
  );
};

export default AuthCard;
