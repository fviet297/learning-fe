import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Nếu đã đăng nhập, chuyển hướng về trang chủ
  if (currentUser) {
    // Lưu lại URL hiện tại để chuyển hướng về sau khi đăng nhập
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
}
