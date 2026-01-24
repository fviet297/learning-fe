import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import PremiumButton from './PremiumButton';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-slate-800 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500 shrink-0">
                                <FiAlertTriangle size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    {message}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <PremiumButton
                                variant="ghost"
                                onClick={onClose}
                                className="text-sm"
                            >
                                Hủy bỏ
                            </PremiumButton>
                            <PremiumButton
                                onClick={onConfirm}
                                className="!bg-rose-600 hover:!bg-rose-700 text-sm !px-6"
                            >
                                Xác nhận xóa
                            </PremiumButton>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmModal;
