import { motion } from 'framer-motion';

const PremiumInput = ({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    icon: Icon,
    className = "",
    required = false
}) => {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-slate-300 ml-1">
                    {label} {required && <span className="text-rose-400">*</span>}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                        <Icon />
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`
            w-full bg-slate-800/50 border border-slate-700 
            ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl
            text-slate-100 placeholder-slate-500
            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
            transition-all duration-200
          `}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300" />
            </div>
        </div>
    );
};

export default PremiumInput;
