/**
 * Format a date string or Date object to a readable format.
 * @param {string|Date} date - the date to format
 * @returns {string} formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format a date string to a short date format.
 * @param {string|Date} date - the date to format
 * @returns {string} formatted short date string
 */
export const formatShortDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
