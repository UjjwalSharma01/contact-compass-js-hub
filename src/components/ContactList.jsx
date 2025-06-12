
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Trash2, Edit, Phone, Mail, Building, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const ContactList = ({ 
  contacts, 
  loading, 
  searchQuery, 
  selectedCategory, 
  onCategoryChange, 
  onContactSelect, 
  onContactDelete 
}) => {
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = searchQuery === '' || 
        contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (contact.phone && contact.phone.includes(searchQuery));

      const matchesCategory = selectedCategory === 'all' || contact.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [contacts, searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(contacts.map(contact => contact.category).filter(Boolean));
    return Array.from(cats);
  }, [contacts]);

  const categoryColors = {
    personal: 'bg-green-100 text-green-700',
    business: 'bg-blue-100 text-blue-700',
    work: 'bg-purple-100 text-purple-700',
    family: 'bg-pink-100 text-pink-700',
    other: 'bg-gray-100 text-gray-700'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-slate-800">Contacts</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Contacts</h1>
            <p className="text-slate-600 mt-1">
              {filteredContacts.length} of {contacts.length} contacts
            </p>
          </div>
          <Link to="/contacts/new">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Filter className="w-4 h-4 text-slate-500" />
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contact Grid */}
        {filteredContacts.length === 0 ? (
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">No contacts found</h3>
              <p className="text-slate-500 mb-4">
                {searchQuery || selectedCategory !== 'all' 
                  ? "Try adjusting your search or filters" 
                  : "Get started by adding your first contact"
                }
              </p>
              <Link to="/contacts/new">
                <Button>Add Your First Contact</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map(contact => (
              <Card key={contact.id} className="hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium shadow-md">
                        {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-800 truncate">
                          {contact.firstName} {contact.lastName}
                        </h3>
                        {contact.jobTitle && (
                          <p className="text-sm text-slate-500 truncate">{contact.jobTitle}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <Link to={`/contacts/edit/${contact.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {contact.firstName} {contact.lastName}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onContactDelete(contact.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {contact.email && (
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail className="w-4 h-4 mr-3 text-slate-400" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center text-sm text-slate-600">
                        <Phone className="w-4 h-4 mr-3 text-slate-400" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    {contact.company && (
                      <div className="flex items-center text-sm text-slate-600">
                        <Building className="w-4 h-4 mr-3 text-slate-400" />
                        <span className="truncate">{contact.company}</span>
                      </div>
                    )}
                  </div>

                  {contact.category && (
                    <div className="mb-4">
                      <Badge className={categoryColors[contact.category] || categoryColors.other}>
                        {contact.category.charAt(0).toUpperCase() + contact.category.slice(1)}
                      </Badge>
                    </div>
                  )}

                  <Link to={`/contacts/${contact.id}`} className="block">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactList;
