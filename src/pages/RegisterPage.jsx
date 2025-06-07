import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserTie, FaLaptop, FaLightbulb, FaRegClipboard } from 'react-icons/fa';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isHovering, setIsHovering] = useState(null);

  const { handleRegister } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    handleRegister(username, password, email, fullName);
  };

  const features = [
    {
      icon: <FaLaptop className="text-teal-500" />,
      title: "Học tập linh hoạt",
      description: "Truy cập tài liệu học tập từ mọi thiết bị"
    },
    {
      icon: <FaLightbulb className="text-yellow-500" />,
      title: "Flashcards thông minh",
      description: "Cải thiện khả năng ghi nhớ với hệ thống flashcards"
    },
    {
      icon: <FaRegClipboard className="text-blue-500" />,
      title: "Kiểm tra kiến thức",
      description: "Kiểm tra và đánh giá tiến độ học tập với quiz"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-0 w-full">
      {/* Mobile Header - Only shown on small screens */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm py-3 px-4 z-10">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-blue-600">Hệ Thống Học Tập</h1>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full flex flex-col lg:flex-row bg-white md:rounded-none shadow-xl overflow-hidden mt-12 md:mt-0"
      >
        {/* Left side - App Introduction - Hidden on mobile */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-6 lg:p-8 text-white"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="h-full flex flex-col">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-2">Bắt Đầu Học Tập Ngay</h1>
              <p className="text-blue-100 mb-8">Đăng ký tài khoản để trải nghiệm đầy đủ tính năng</p>
            </motion.div>
            
            <div className="flex-1">
              <img 
                src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7885.jpg" 
                alt="Đăng ký tài khoản" 
                className="object-cover rounded-lg shadow-lg mb-8 max-w-full"
              />
              
              <div className="space-y-3 sm:space-y-4">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                    onMouseEnter={() => setIsHovering(index)}
                    onMouseLeave={() => setIsHovering(null)}
                  >
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center mr-3">
                      {feature.icon}
                    </div>
                    <div>
                      <motion.h3 
                        className="text-lg font-medium"
                        animate={{ scale: isHovering === index ? 1.03 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {feature.title}
                      </motion.h3>
                      <p className="mt-1 text-sm text-blue-100">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Right side - Register Form */}
        <motion.div 
          className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 flex items-center justify-center overflow-y-auto"
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full max-w-md">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng Ký Tài Khoản</h2>
              <p className="text-gray-600">Tạo tài khoản để bắt đầu học tập</p>
            </motion.div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserTie className="text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Nhập họ và tên đầy đủ"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Chọn tên đăng nhập"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Nhập địa chỉ email"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Tạo mật khẩu"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-start mt-4">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-xs sm:text-sm">
                  <label htmlFor="terms" className="text-gray-700">
                    Tôi đồng ý với <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
                  </label>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 text-center px-2">
                  Bằng cách đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
                </p>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 sm:py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 active:scale-95"
              >
                Đăng Ký
              </button>
            </form>
            
            <div className="mt-6">
              <p className="text-center text-xs sm:text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-blue-600 hover:underline font-medium whitespace-nowrap">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default RegisterPage;