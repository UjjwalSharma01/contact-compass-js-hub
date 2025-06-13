
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from './components/ThemeProvider';

// Components
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import ContactDetails from './components/ContactDetails';

// Hooks and utilities
import { useContacts } from './hooks/useContacts';
import { useLocalStorage } from './hooks/useLocalStorage';

const App = () => {
  const { contacts, loading, addContact, updateContact, deleteContact } = useContacts();
  const [searchQuery, setSearchQuery] = useLocalStorage('contactSearch', '');
  const [selectedCategory, setSelectedCategory] = useLocalStorage('selectedCategory', 'all');
  const [selectedContact, setSelectedContact] = useState(null);

  console.log('App loaded with contacts:', contacts.length);

  return (
    <ThemeProvider>
      <TooltipProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Navigation 
              contactCount={contacts.length}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            
            <main className="container mx-auto px-4 py-6">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Dashboard 
                      contacts={contacts}
                      loading={loading}
                    />
                  } 
                />
                <Route 
                  path="/contacts" 
                  element={
                    <ContactList 
                      contacts={contacts}
                      loading={loading}
                      searchQuery={searchQuery}
                      selectedCategory={selectedCategory}
                      onCategoryChange={setSelectedCategory}
                      onContactSelect={setSelectedContact}
                      onContactDelete={deleteContact}
                    />
                  } 
                />
                <Route 
                  path="/contacts/new" 
                  element={
                    <ContactForm 
                      onSubmit={addContact}
                      title="Add New Contact"
                    />
                  } 
                />
                <Route 
                  path="/contacts/edit/:id" 
                  element={
                    <ContactForm 
                      onSubmit={updateContact}
                      title="Edit Contact"
                      contacts={contacts}
                    />
                  } 
                />
                <Route 
                  path="/contacts/:id" 
                  element={
                    <ContactDetails 
                      contacts={contacts}
                      onEdit={updateContact}
                      onDelete={deleteContact}
                    />
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
          
          <Toaster />
          <Sonner />
        </Router>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
