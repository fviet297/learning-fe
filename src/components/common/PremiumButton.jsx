import { motion } from 'framer-motion';

const PremiumButton = ({
    children,
    onClick,
    variant = 'primary',
    className = "",
    disabled = false,
    type = "button",
    icon: Icon
}) => {
    const variants = {
        primary: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30",
        secondary: "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600",
        danger: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/30",
        ghost: "bg-transparent hover:bg-white/10 text-slate-300 hover:text-white"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        relative px-6 py-3 rounded-xl font-medium
        flex items-center justify-center gap-2
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
        >
            {Icon && <Icon className="text-xl" />}
            {children}
        </motion.button>
    );
};

export default PremiumButton;
