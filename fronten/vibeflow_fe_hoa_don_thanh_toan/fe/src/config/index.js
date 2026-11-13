/**
 * VibeFlow Sneaker - Global Application Configuration
 * International Standard Enterprise Configuration
 */

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'VibeFlow Sneakers',
  version: '1.0.0',
  description: 'Hệ thống Quản lý Bán giày & POS Đa kênh Hiện đại',
  
  // API Endpoints
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  apiPrefix: '/api',
  apiTimeout: 15000,

  // Pagination defaults
  pagination: {
    defaultPage: 0,
    defaultPageSize: 10,
    pageSizes: [5, 10, 20, 50, 100],
  },

  // LocalStorage / Cookie keys
  storageKeys: {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    userProfile: 'user_profile',
    activeTab: 'admin_active_tab',
    cartData: 'vibeflow_cart',
  },

  // Brand Theme Colors
  theme: {
    primary: '#7c3aed', // violet-600
    primaryHover: '#6d28d9', // violet-700
    accent: '#8b5cf6', // violet-500
    surface: '#ffffff',
    background: '#f8fafc', // slate-50
    darkBackground: '#09090b', // zinc-950
  },
};

export default APP_CONFIG;
