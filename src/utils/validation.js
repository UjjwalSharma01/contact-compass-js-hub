
/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone validation regex (supports various formats)
 */
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  return PHONE_REGEX.test(cleaned);
};

/**
 * Validate contact data
 * @param {Object} contact - Contact object to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateContact = (contact) => {
  const errors = [];

  // Required fields validation
  if (!contact.firstName || contact.firstName.trim().length === 0) {
    errors.push('First name is required');
  }

  if (!contact.lastName || contact.lastName.trim().length === 0) {
    errors.push('Last name is required');
  }

  // Email validation (required)
  if (!contact.email || contact.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!isValidEmail(contact.email)) {
    errors.push('Please enter a valid email address');
  }

  // Phone validation (optional but must be valid if provided)
  if (contact.phone && contact.phone.trim().length > 0) {
    if (!isValidPhone(contact.phone)) {
      errors.push('Please enter a valid phone number');
    }
  }

  // Name length validation
  if (contact.firstName && contact.firstName.length > 50) {
    errors.push('First name must be less than 50 characters');
  }

  if (contact.lastName && contact.lastName.length > 50) {
    errors.push('Last name must be less than 50 characters');
  }

  // Company and job title length validation
  if (contact.company && contact.company.length > 100) {
    errors.push('Company name must be less than 100 characters');
  }

  if (contact.jobTitle && contact.jobTitle.length > 100) {
    errors.push('Job title must be less than 100 characters');
  }

  // Address length validation
  if (contact.address && contact.address.length > 200) {
    errors.push('Address must be less than 200 characters');
  }

  // Notes length validation
  if (contact.notes && contact.notes.length > 500) {
    errors.push('Notes must be less than 500 characters');
  }

  // Category validation
  const validCategories = ['personal', 'business', 'work', 'family', 'other'];
  if (contact.category && !validCategories.includes(contact.category)) {
    errors.push('Please select a valid category');
  }

  // Tags validation
  if (contact.tags && Array.isArray(contact.tags)) {
    if (contact.tags.length > 10) {
      errors.push('Maximum 10 tags allowed');
    }
    
    contact.tags.forEach((tag, index) => {
      if (typeof tag !== 'string' || tag.trim().length === 0) {
        errors.push(`Tag ${index + 1} cannot be empty`);
      } else if (tag.length > 20) {
        errors.push(`Tag "${tag}" must be less than 20 characters`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize input string by trimming and removing dangerous characters
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>'"]/g, '') // Remove potentially dangerous characters
    .substring(0, 1000); // Limit length
};

/**
 * Validate and sanitize form data
 * @param {Object} formData - Form data to process
 * @returns {Object} Cleaned and validated data
 */
export const processFormData = (formData) => {
  const processed = {
    firstName: sanitizeInput(formData.firstName || ''),
    lastName: sanitizeInput(formData.lastName || ''),
    email: sanitizeInput(formData.email || '').toLowerCase(),
    phone: sanitizeInput(formData.phone || ''),
    company: sanitizeInput(formData.company || ''),
    jobTitle: sanitizeInput(formData.jobTitle || ''),
    address: sanitizeInput(formData.address || ''),
    notes: sanitizeInput(formData.notes || ''),
    category: formData.category || 'other',
    tags: Array.isArray(formData.tags) 
      ? formData.tags.map(tag => sanitizeInput(tag)).filter(Boolean)
      : []
  };

  return processed;
};
