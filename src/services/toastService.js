import { toast } from 'react-toastify';

// Lưu trữ ID của các toast đang hiển thị để tránh trùng lặp
const activeToasts = new Set();

// Thời gian tối thiểu giữa các toast giống nhau (ms)
const MIN_TOAST_INTERVAL = 2000;

// Lưu trữ thời gian hiển thị toast gần nhất theo message
const lastToastTimestamps = {};

// Wrapper cho các hàm toast để tránh hiển thị trùng lặp
const showToast = (message, type = 'info', options = {}) => {
  const toastId = `${type}-${message}`;
  
  // Kiểm tra xem toast đã tồn tại chưa
  if (activeToasts.has(toastId)) {
    return;
  }
  
  // Kiểm tra thời gian giữa các toast trùng lặp
  const now = Date.now();
  const lastShown = lastToastTimestamps[toastId] || 0;
  if (now - lastShown < MIN_TOAST_INTERVAL) {
    return;
  }
  
  // Cập nhật timestamp
  lastToastTimestamps[toastId] = now;
  
  // Thêm vào danh sách đang hiển thị
  activeToasts.add(toastId);
  
  // Hiển thị toast với config
  const defaultOptions = {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    onClose: () => {
      // Xóa khỏi danh sách active khi đóng
      setTimeout(() => {
        activeToasts.delete(toastId);
      }, 300);
    }
  };
  
  // Merge options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Hiển thị toast
  return toast[type](message, mergedOptions);
};

// Các hàm export để sử dụng
export const showSuccess = (message, options = {}) => {
  return showToast(message, 'success', options);
};

export const showError = (message, options = {}) => {
  return showToast(message, 'error', options);
};

export const showWarning = (message, options = {}) => {
  return showToast(message, 'warning', options);
};

export const showInfo = (message, options = {}) => {
  return showToast(message, 'info', options);
};

// Hàm để xóa hết các toast
export const dismissAll = () => {
  toast.dismiss();
  activeToasts.clear();
};
