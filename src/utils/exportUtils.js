
import { jsPDF } from 'jspdf';
import { formatDate } from './helpers';

/**
 * Export contacts to JSON format
 * @param {Array} contacts - Array of contacts
 * @param {string} filename - File name without extension
 */
export const exportToJSON = (contacts, filename = 'contacts') => {
  const jsonData = JSON.stringify(contacts, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Export contacts to PDF format
 * @param {Array} contacts - Array of contacts
 * @param {string} filename - File name without extension
 */
export const exportToPDF = (contacts, filename = 'contacts') => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  let y = 20;
  
  // Title
  doc.setFontSize(20);
  doc.text('Contact List', 20, y);
  y += 15;
  
  // Generated date
  doc.setFontSize(10);
  doc.text(`Generated on: ${formatDate(new Date().toISOString())}`, 20, y);
  y += 15;
  
  // Total contacts
  doc.text(`Total Contacts: ${contacts.length}`, 20, y);
  y += 20;

  contacts.forEach((contact, index) => {
    // Check if we need a new page
    if (y > pageHeight - 60) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`${contact.firstName} ${contact.lastName}`, 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    if (contact.jobTitle) {
      doc.text(`Title: ${contact.jobTitle}`, 25, y);
      y += 6;
    }
    
    if (contact.company) {
      doc.text(`Company: ${contact.company}`, 25, y);
      y += 6;
    }
    
    if (contact.email) {
      doc.text(`Email: ${contact.email}`, 25, y);
      y += 6;
    }
    
    if (contact.phone) {
      doc.text(`Phone: ${contact.phone}`, 25, y);
      y += 6;
    }
    
    if (contact.address) {
      doc.text(`Address: ${contact.address}`, 25, y);
      y += 6;
    }
    
    if (contact.category) {
      doc.text(`Category: ${contact.category.charAt(0).toUpperCase() + contact.category.slice(1)}`, 25, y);
      y += 6;
    }
    
    if (contact.notes) {
      const lines = doc.splitTextToSize(`Notes: ${contact.notes}`, 160);
      doc.text(lines, 25, y);
      y += lines.length * 6;
    }
    
    y += 10; // Space between contacts
  });

  doc.save(`${filename}.pdf`);
};

/**
 * Export contacts to CSV format
 * @param {Array} contacts - Array of contacts
 * @param {string} filename - File name without extension
 */
export const exportToCSV = (contacts, filename = 'contacts') => {
  const headers = [
    'First Name', 'Last Name', 'Email', 'Phone', 'Company', 
    'Job Title', 'Address', 'Category', 'Tags', 'Notes', 
    'Created At', 'Updated At'
  ];

  const csvContent = [
    headers.join(','),
    ...contacts.map(contact => [
      contact.firstName || '',
      contact.lastName || '',
      contact.email || '',
      contact.phone || '',
      contact.company || '',
      contact.jobTitle || '',
      contact.address || '',
      contact.category || '',
      (contact.tags || []).join('; '),
      contact.notes || '',
      formatDate(contact.createdAt),
      formatDate(contact.updatedAt)
    ].map(field => `"${field}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
