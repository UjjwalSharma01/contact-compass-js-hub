
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Building, Calendar, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime, formatDate } from '../utils/helpers';

const Dashboard = ({ contacts, loading }) => {
  const stats = useMemo(() => {
    if (!contacts.length) {
      return {
        total: 0,
        byCategory: {},
        recentContacts: [],
        companiesCount: 0,
        recentActivity: []
      };
    }

    // Calculate category distribution
    const byCategory = contacts.reduce((acc, contact) => {
      const category = contact.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentContacts = contacts
      .filter(contact => new Date(contact.createdAt) > sevenDaysAgo)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const companies = new Set(
      contacts
        .map(contact => contact.company)
        .filter(company => company && company.trim().length > 0)
    );

    const recentActivity = contacts
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    return {
      total: contacts.length,
      byCategory,
      recentContacts,
      companiesCount: companies.size,
      recentActivity
    };
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
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/2"></div>
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
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-600 mt-1">Overview of your contact management</p>
          </div>
          <Link to="/contacts/new">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Contacts</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Companies</p>
                  <p className="text-3xl font-bold text-green-700">{stats.companiesCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
                  <Building className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">This Week</p>
                  <p className="text-3xl font-bold text-purple-700">{stats.recentContacts.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Categories</p>
                  <p className="text-3xl font-bold text-orange-700">{Object.keys(stats.byCategory).length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Breakdown */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Categories</span>
              </CardTitle>
              <CardDescription>Contact distribution by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className={categoryColors[category] || categoryColors.other}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Badge>
                  </div>
                  <span className="font-semibold text-slate-700">{count}</span>
                </div>
              ))}
              {Object.keys(stats.byCategory).length === 0 && (
                <p className="text-slate-500 text-center py-8">No contacts yet</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Recently updated contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.recentActivity.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="text-sm text-slate-500">{contact.company || contact.email}</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-500">
                    {formatRelativeTime(contact.updatedAt)}
                  </span>
                </div>
              ))}
              {stats.recentActivity.length === 0 && (
                <p className="text-slate-500 text-center py-8">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your contact management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/contacts/new">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center space-y-2 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200">
                  <UserPlus className="w-6 h-6" />
                  <span>Add New Contact</span>
                </Button>
              </Link>
              
              <Link to="/contacts">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center space-y-2 hover:bg-green-50 hover:border-green-200 transition-all duration-200">
                  <Users className="w-6 h-6" />
                  <span>View All Contacts</span>
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full h-24 flex flex-col items-center space-y-2 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200"
                onClick={() => {
                  // TODO: Implement CSV export
                  console.log('Export functionality coming soon');
                }}
              >
                <Activity className="w-6 h-6" />
                <span>Export Contacts</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
