
export const exportContactsToCSV = (contacts) => {
  if (!contacts || contacts.length === 0) {
    return;
  }

  const headers = [
    'First Name',
    'Last Name', 
    'Email',
    'Phone',
    'Company',
    'Job Title',
    'Category',
    'Address',
    'Notes',
    'Created Date'
  ];

  const csvContent = [
    headers.join(','),
    ...contacts.map(contact => [
      escapeCSVField(contact.firstName || ''),
      escapeCSVField(contact.lastName || ''),
      escapeCSVField(contact.email || ''),
      escapeCSVField(contact.phone || ''),
      escapeCSVField(contact.company || ''),
      escapeCSVField(contact.jobTitle || ''),
      escapeCSVField(contact.category || ''),
      escapeCSVField(contact.address || ''),
      escapeCSVField(contact.notes || ''),
      escapeCSVField(contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : '')
    ].join(','))
  ].join('\n');

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contacts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const escapeCSVField = (field) => {
  if (field === null || field === undefined) {
    return '';
  }
  
  const stringField = String(field);
  
  // If field contains comma, newline, or quote, wrap in quotes and escape quotes
  if (stringField.includes(',') || stringField.includes('\n') || stringField.includes('"')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  
  return stringField;
};

export const exportContactsToPDF = async (contacts) => {
  // This would require a PDF library like jsPDF
  // For now, we'll show a message that this feature needs implementation
  console.log('PDF export would be implemented with jsPDF library');
  alert('PDF export feature would be implemented with jsPDF library');
};
