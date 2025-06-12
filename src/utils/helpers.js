
/**
 * Generate a unique ID
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a date to a relative time string
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

/**
 * Capitalize the first letter of a string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Get initials from a name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} Initials (e.g., "JD")
 */
export const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last;
};

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Filter contacts based on search query and category
 * @param {Array} contacts - Array of contacts
 * @param {string} searchQuery - Search query
 * @param {string} category - Category filter
 * @returns {Array} Filtered contacts
 */
export const filterContacts = (contacts, searchQuery, category) => {
  let filtered = contacts;

  // Filter by category
  if (category && category !== 'all') {
    filtered = filtered.filter(contact => contact.category === category);
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(contact => 
      contact.firstName.toLowerCase().includes(query) ||
      contact.lastName.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.phone.includes(query) ||
      contact.company.toLowerCase().includes(query) ||
      contact.jobTitle.toLowerCase().includes(query) ||
      contact.notes.toLowerCase().includes(query) ||
      contact.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  return filtered;
};

/**
 * Export contacts to CSV format
 * @param {Array} contacts - Array of contacts
 * @returns {string} CSV string
 */
export const exportToCSV = (contacts) => {
  const headers = [
    'First Name', 'Last Name', 'Email', 'Phone', 'Company', 
    'Job Title', 'Address', 'Category', 'Tags', 'Notes', 
    'Created At', 'Updated At'
  ];

  const csvContent = [
    headers.join(','),
    ...contacts.map(contact => [
      contact.firstName,
      contact.lastName,
      contact.email,
      contact.phone,
      contact.company,
      contact.jobTitle,
      contact.address,
      contact.category,
      contact.tags.join('; '),
      contact.notes,
      formatDate(contact.createdAt),
      formatDate(contact.updatedAt)
    ].map(field => `"${field || ''}"`).join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Download a file with given content
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} contentType - MIME type
 */
export const downloadFile = (content, filename, contentType) => {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
