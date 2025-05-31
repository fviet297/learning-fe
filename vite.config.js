import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind tới 0.0.0.0 để Render có thể truy cập
    port: process.env.PORT || 3000, // Sử dụng biến PORT từ Render
  },
});