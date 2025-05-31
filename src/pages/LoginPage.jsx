import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaLaptop, FaLightbulb, FaRegClipboard, FaLock, FaEnvelope } from 'react-icons/fa';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin } = useContext(AuthContext);
  const [isHovering, setIsHovering] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(username, password);
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full flex flex-col md:flex-row bg-white md:rounded-none shadow-xl overflow-hidden"
      >
        {/* Left side - App Introduction */}
        <motion.div 
          className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-8 text-white"
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
              <h1 className="text-3xl font-bold mb-2">Học Tập Thông Minh</h1>
              <p className="text-blue-100 mb-8">Nền tảng hỗ trợ học tập toàn diện cho mọi người</p>
            </motion.div>
            
            <div className="flex-1">
              <img 
                src="https://img.freepik.com/free-vector/online-learning-concept-illustration_114360-4735.jpg" 
                alt="Học tập trực tuyến" 
                className="object-cover rounded-lg shadow-lg mb-8 max-w-full"
              />
              
              <div className="space-y-6">
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
        
        {/* Right side - Login Form */}
        <motion.div 
          className="md:w-1/2 p-8 flex items-center justify-center"
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full max-w-md">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng Nhập</h2>
              <p className="text-gray-600">Chào mừng bạn quay trở lại</p>
            </motion.div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Nhập tên đăng nhập của bạn"
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
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Quên mật khẩu?</a>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Đăng Nhập
              </motion.button>
            </form>
            
            <div className="mt-6">
              <p className="text-center text-gray-600 text-sm">
                Chưa có tài khoản? <Link to="/register" className="text-blue-600 hover:text-blue-500 hover:underline font-medium">Đăng ký ngay</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginPage;