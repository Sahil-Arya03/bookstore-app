/**
 * Format a number as currency (USD).
 * @param {number} amount - the amount to format
 * @returns {string} formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
