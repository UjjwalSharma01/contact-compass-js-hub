
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { contactService } from '../services/contactService';
import { validateContact } from '../utils/validation';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load contacts on mount
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const loadedContacts = await contactService.getAllContacts();
      setContacts(loadedContacts);
      console.log('Contacts loaded:', loadedContacts.length);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load contacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contactData) => {
    try {
      // Validate contact data
      const validation = validateContact(contactData);
      if (!validation.isValid) {
        toast({
          title: "Validation Error",
          description: validation.errors.join(', '),
          variant: "destructive",
        });
        return false;
      }

      const newContact = await contactService.createContact(contactData);
      setContacts(prev => [newContact, ...prev]);
      
      toast({
        title: "Success",
        description: "Contact added successfully",
      });
      
      console.log('Contact added:', newContact);
      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add contact",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateContact = async (id, contactData) => {
    try {
      const validation = validateContact(contactData);
      if (!validation.isValid) {
        toast({
          title: "Validation Error",
          description: validation.errors.join(', '),
          variant: "destructive",
        });
        return false;
      }

      const updatedContact = await contactService.updateContact(id, contactData);
      setContacts(prev => 
        prev.map(contact => 
          contact.id === id ? updatedContact : contact
        )
      );
      
      toast({
        title: "Success",
        description: "Contact updated successfully",
      });
      
      console.log('Contact updated:', updatedContact);
      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteContact = async (id) => {
    try {
      await contactService.deleteContact(id);
      setContacts(prev => prev.filter(contact => contact.id !== id));
      
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
      
      console.log('Contact deleted:', id);
      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    reloadContacts: loadContacts
  };
};
