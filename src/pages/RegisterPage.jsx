import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaAddressCard, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import { toast } from 'react-toastify';
import PremiumInput from '../components/common/PremiumInput';
import PremiumButton from '../components/common/PremiumButton';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { handleRegister } = useContext(AuthContext);

  const handleChange = (e) => {
    // PremiumInput returns a full event object, so this works fine
    setFormData({ ...formData, [e.target.name || e.target.id]: e.target.value });
  };

  // Wrapper for PremiumInput to handle name prop (PremiumInput needs updating or we pass props)
  // PremiumInput accepts value and onChange, but we need to ensure it propagates the name for the generic handler
  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    setIsLoading(true);
    try {
      await handleRegister(formData.username, formData.password, formData.email, formData.fullName);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-slate-900">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Left Side: Visual (Swapped for Register) */}
        <div className="hidden lg:flex flex-col justify-center p-12 relative bg-gradient-to-br from-indigo-600/90 to-purple-700/90 text-white order-last">
          <h1 className="text-4xl font-bold mb-4 leading-tight text-right">
            Gia Nhập <br /> Cộng Đồng
          </h1>
          <p className="text-indigo-100 text-lg mb-8 text-right ml-auto max-w-sm">
            Bắt đầu hành trình chinh phục kiến thức với các công cụ học tập tốt nhất.
          </p>
          <div className="relative z-10 flex justify-end">
            <img
              src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7885.jpg"
              alt="Register"
              className="rounded-2xl shadow-lg border border-white/20 opacity-90 hover:scale-105 transition-transform duration-500 max-w-md"
            />
          </div>
          {/* Decor Circles */}
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-slate-900/40">
          <div className="max-w-xl w-full mx-auto">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">Đăng Ký</h2>
              <p className="text-slate-400">Tạo tài khoản mới hoàn toàn miễn phí</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PremiumInput
                  label="Họ và tên"
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  placeholder="Nguyễn Văn A"
                  icon={FaAddressCard}
                  required
                />
                <PremiumInput
                  label="Tên đăng nhập"
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  placeholder="username"
                  icon={FaUser}
                  required
                />
              </div>

              <PremiumInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="name@example.com"
                icon={FaEnvelope}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <PremiumInput
                    label="Mật khẩu"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    placeholder="••••••••"
                    icon={FaLock}
                    required
                  />
                </div>
                <div className="relative">
                  <PremiumInput
                    label="Xác nhận"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    placeholder="••••••••"
                    icon={FaLock}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[38px] text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-start text-sm">
                <label className="flex items-start text-slate-400 cursor-pointer mt-2">
                  <input type="checkbox" required className="mt-1 mr-2 rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500/50" />
                  <span>Tôi đồng ý với <a href="#" className="text-indigo-400 font-bold hover:underline">Điều khoản</a> và <a href="#" className="text-indigo-400 font-bold hover:underline">Chính sách bảo mật</a></span>
                </label>
              </div>

              <PremiumButton
                type="submit"
                variant="primary"
                className="w-full mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng Ký Tài Khoản"}
                {!isLoading && <HiArrowRight />}
              </PremiumButton>
            </form>

            <div className="mt-8 text-center text-slate-400 text-sm border-t border-slate-800 pt-6">
              Bạn đã có tài khoản?{' '}
              <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default RegisterPage;