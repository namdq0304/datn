/**
 * Standard Application Utilities (VibeFlow Sneaker)
 * International Standard Helper Functions
 */

/**
 * Format numeric value to Vietnamese Dong (VND) currency string
 * @param {number|string} amount
 * @returns {string} e.g. "1.500.000 đ"
 */
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return `${num.toLocaleString('vi-VN')} đ`;
};

/**
 * Format ISO or Date string to DD/MM/YYYY
 * @param {string|Date} dateInput
 * @returns {string} e.g. "16/08/2026"
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  if (typeof dateInput === 'string' && dateInput.includes('-')) {
    const parts = dateInput.split('T')[0].split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Truncate long strings with ellipsis
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
export const truncateText = (str, maxLen = 30) => {
  if (!str || str.length <= maxLen) return str || '';
  return `${str.substring(0, maxLen)}...`;
};

// Re-export admin utilities for unified import access
export * from '../components/admin/utils';
