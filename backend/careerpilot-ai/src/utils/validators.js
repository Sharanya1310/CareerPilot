/**
 * Validator Utility
 * Reusable validation helpers for common fields
 */

export const validators = {
  /**
   * Validate email format
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   * Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
   */
  isStrongPassword: (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  /**
   * Validate MongoDB ObjectId
   */
  isValidObjectId: (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  },

  /**
   * Validate URL format
   */
  isValidURL: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate phone number (basic international format)
   */
  isValidPhone: (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ""));
  },

  /**
   * Validate string length
   */
  isValidLength: (str, min = 1, max = 255) => {
    return str && str.length >= min && str.length <= max;
  },

  /**
   * Check if string is not empty
   */
  isEmpty: (str) => {
    return !str || str.trim().length === 0;
  },

  /**
   * Validate pagination parameters
   */
  isValidPagination: (page, limit) => {
    return Number.isInteger(page) && Number.isInteger(limit) && page > 0 && limit > 0;
  },
};
