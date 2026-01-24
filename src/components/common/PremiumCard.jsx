import { motion } from 'framer-motion';

const PremiumCard = ({ children, className = "", onClick, hoverEffect = true }) => {
    return (
        <motion.div
            whileHover={hoverEffect ? { y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" } : {}}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className={`
        glass-panel rounded-2xl p-6
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
};

export default PremiumCard;
