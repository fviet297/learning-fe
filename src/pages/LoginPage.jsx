import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import PremiumInput from '../components/common/PremiumInput';
import PremiumButton from '../components/common/PremiumButton';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleLogin(username, password);
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
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Left Side: Visual */}
        <div className="hidden lg:flex flex-col justify-center p-12 relative bg-gradient-to-br from-indigo-600/90 to-purple-700/90 text-white">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Chào mừng trở lại!
          </h1>
          <p className="text-indigo-100 text-lg mb-8 max-w-sm">
            Tiếp tục hành trình chinh phục tri thức của bạn ngay hôm nay.
          </p>
          <div className="relative z-10">
            <img
              src="https://img.freepik.com/free-vector/online-learning-concept-illustration_114360-4735.jpg"
              alt="Login"
              className="rounded-2xl shadow-lg border border-white/20 opacity-90 hover:scale-105 transition-transform duration-500"
            />
          </div>
          {/* Decor Circles */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-slate-900/40">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">Đăng Nhập</h2>
              <p className="text-slate-400">Nhập thông tin tài khoản của bạn</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <PremiumInput
                label="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập username"
                icon={FaUser}
                required
              />

              <div className="relative">
                <PremiumInput
                  label="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center text-slate-400 cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500/50" />
                  Ghi nhớ tôi
                </label>
                <a href="#" className="text-indigo-400 hover:text-indigo-300">Quên mật khẩu?</a>
              </div>

              <PremiumButton
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
                {!isLoading && <HiArrowRight />}
              </PremiumButton>
            </form>

            <div className="mt-8 text-center text-slate-400 text-sm">
              Bạn chưa có tài khoản?{' '}
              <Link to="/register" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;