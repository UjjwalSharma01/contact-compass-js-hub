
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Mail, Phone, Building, MapPin, FileText, Calendar, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { formatDate } from '../utils/helpers';

const ContactDetails = ({ contacts, onEdit, onDelete }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const contact = contacts.find(c => c.id === id);

  if (!contact) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/contacts')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Contacts</span>
          </Button>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-medium text-slate-700 mb-2">Contact not found</h3>
            <p className="text-slate-500 mb-4">The contact you're looking for doesn't exist.</p>
            <Link to="/contacts">
              <Button>Back to Contacts</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryColors = {
    personal: 'bg-green-100 text-green-700',
    business: 'bg-blue-100 text-blue-700',
    work: 'bg-purple-100 text-purple-700',
    family: 'bg-pink-100 text-pink-700',
    other: 'bg-gray-100 text-gray-700'
  };

  const handleDelete = async () => {
    const success = await onDelete(contact.id);
    if (success) {
      navigate('/contacts');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/contacts')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Contacts</span>
        </Button>
        
        <div className="flex space-x-2">
          <Link to={`/contacts/edit/${contact.id}`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
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
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Contact Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-800">
                {contact.firstName} {contact.lastName}
              </h1>
              {contact.jobTitle && (
                <p className="text-lg text-slate-600 mt-1">{contact.jobTitle}</p>
              )}
              {contact.company && (
                <p className="text-slate-500">{contact.company}</p>
              )}
              {contact.category && (
                <div className="mt-3">
                  <Badge className={categoryColors[contact.category] || categoryColors.other}>
                    <Tag className="w-3 h-3 mr-1" />
                    {contact.category.charAt(0).toUpperCase() + contact.category.slice(1)}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contact.email && (
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium">Email</p>
                <a 
                  href={`mailto:${contact.email}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          )}

          {contact.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium">Phone</p>
                <a 
                  href={`tel:${contact.phone}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          )}

          {contact.company && (
            <div className="flex items-center space-x-3">
              <Building className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium">Company</p>
                <p className="text-slate-600">{contact.company}</p>
              </div>
            </div>
          )}

          {contact.address && (
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-slate-500 mt-1" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-slate-600 whitespace-pre-line">{contact.address}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      {contact.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 whitespace-pre-line">{contact.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-medium text-slate-700">Created</p>
            <p className="text-slate-500">{formatDate(contact.createdAt)}</p>
          </div>
          <div>
            <p className="font-medium text-slate-700">Last Updated</p>
            <p className="text-slate-500">{formatDate(contact.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactDetails;
