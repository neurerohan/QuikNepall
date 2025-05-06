import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BounceProps {
  children: ReactNode;
  className?: string;
}

const Bounce = ({ children, className = '' }: BounceProps) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        transition: { 
          type: 'spring', 
          stiffness: 400, 
          damping: 10 
        } 
      }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Bounce;
