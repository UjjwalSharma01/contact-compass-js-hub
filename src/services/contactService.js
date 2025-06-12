
import { generateId } from '../utils/helpers';

// Simulate a database with localStorage
const STORAGE_KEY = 'contacts_db';

// Sample data for demonstration
const sampleContacts = [
  {
    id: generateId(),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Solutions Inc.',
    jobTitle: 'Software Engineer',
    address: '123 Main St, New York, NY 10001',
    notes: 'Excellent developer with React expertise',
    category: 'work',
    tags: ['developer', 'react', 'javascript'],
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
    lastContactDate: new Date('2024-06-01').toISOString()
  },
  {
    id: generateId(),
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 987-6543',
    company: 'Marketing Pro',
    jobTitle: 'Marketing Director',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    notes: 'Great contact for marketing partnerships',
    category: 'business',
    tags: ['marketing', 'partnerships'],
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-02-10').toISOString(),
    lastContactDate: new Date('2024-05-15').toISOString()
  },
  {
    id: generateId(),
    firstName: 'Mike',
    lastName: 'Wilson',
    email: 'mike.wilson@gmail.com',
    phone: '+1 (555) 456-7890',
    company: '',
    jobTitle: '',
    address: '789 Pine St, Chicago, IL 60601',
    notes: 'College friend, keep in touch',
    category: 'personal',
    tags: ['friend', 'college'],
    createdAt: new Date('2024-03-05').toISOString(),
    updatedAt: new Date('2024-03-05').toISOString(),
    lastContactDate: new Date('2024-06-10').toISOString()
  }
];

class ContactService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleContacts));
      console.log('Initialized contact database with sample data');
    }
  }

  async getAllContacts() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const data = localStorage.getItem(STORAGE_KEY);
    const contacts = data ? JSON.parse(data) : [];
    
    // Sort by last updated (most recent first)
    return contacts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async getContactById(id) {
    const contacts = await this.getAllContacts();
    return contacts.find(contact => contact.id === id);
  }

  async createContact(contactData) {
    const contacts = await this.getAllContacts();
    
    const newContact = {
      ...contactData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastContactDate: new Date().toISOString()
    };

    const updatedContacts = [newContact, ...contacts];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContacts));
    
    console.log('Created new contact:', newContact);
    return newContact;
  }

  async updateContact(id, contactData) {
    const contacts = await this.getAllContacts();
    
    const contactIndex = contacts.findIndex(contact => contact.id === id);
    if (contactIndex === -1) {
      throw new Error('Contact not found');
    }

    const updatedContact = {
      ...contacts[contactIndex],
      ...contactData,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    contacts[contactIndex] = updatedContact;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    
    console.log('Updated contact:', updatedContact);
    return updatedContact;
  }

  async deleteContact(id) {
    const contacts = await this.getAllContacts();
    const filteredContacts = contacts.filter(contact => contact.id !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredContacts));
    console.log('Deleted contact:', id);
    return true;
  }

  async searchContacts(query) {
    const contacts = await this.getAllContacts();
    const searchTerm = query.toLowerCase();
    
    return contacts.filter(contact => 
      contact.firstName.toLowerCase().includes(searchTerm) ||
      contact.lastName.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm) ||
      contact.phone.includes(searchTerm) ||
      contact.company.toLowerCase().includes(searchTerm) ||
      contact.jobTitle.toLowerCase().includes(searchTerm) ||
      contact.notes.toLowerCase().includes(searchTerm) ||
      contact.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
}

export const contactService = new ContactService();
