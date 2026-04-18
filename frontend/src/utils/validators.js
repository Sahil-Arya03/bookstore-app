/**
 * Client-side form validation utilities.
 */

/**
 * Validate registration form fields.
 * @param {Object} data - { name, email, password, confirmPassword, phone }
 * @returns {Object} errors object with field-level error messages
 */
export const validateRegistration = (data) => {
  const errors = {};

  if (!data.name?.trim()) errors.name = 'Name is required';
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email format is invalid';
  }
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  if (data.phone && !/^[+]?[0-9]{10,15}$/.test(data.phone)) {
    errors.phone = 'Phone number must be 10-15 digits';
  }

  return errors;
};

/**
 * Validate login form fields.
 * @param {Object} data - { email, password }
 * @returns {Object} errors object with field-level error messages
 */
export const validateLogin = (data) => {
  const errors = {};

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email format is invalid';
  }
  if (!data.password) errors.password = 'Password is required';

  return errors;
};

/**
 * Validate checkout form fields.
 * @param {Object} data - { shippingAddress, paymentMethod }
 * @returns {Object} errors object with field-level error messages
 */
export const validateCheckout = (data) => {
  const errors = {};

  if (!data.shippingAddress?.trim()) errors.shippingAddress = 'Shipping address is required';
  if (!data.paymentMethod?.trim()) errors.paymentMethod = 'Payment method is required';

  return errors;
};

/**
 * Validate book form fields.
 * @param {Object} data - book form data
 * @returns {Object} errors object with field-level error messages
 */
export const validateBook = (data) => {
  const errors = {};

  if (!data.title?.trim()) errors.title = 'Title is required';
  if (!data.author?.trim()) errors.author = 'Author is required';
  if (!data.isbn?.trim()) errors.isbn = 'ISBN is required';
  if (!data.price || data.price <= 0) errors.price = 'Price must be greater than 0';
  if (data.stockQuantity === undefined || data.stockQuantity < 0) errors.stockQuantity = 'Stock cannot be negative';
  if (!data.categoryId) errors.categoryId = 'Category is required';

  return errors;
};
