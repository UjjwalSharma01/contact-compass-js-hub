
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Users, Plus, Home, Search, LogOut, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../hooks/useAuth';

const Navigation = ({ contactCount, searchQuery, onSearchChange }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const navItems = [
    {
      to: '/',
      icon: Home,
      label: 'Dashboard',
      exact: true
    },
    {
      to: '/contacts',
      icon: Users,
      label: 'Contacts',
      badge: contactCount
    }
  ];

  const isSearchVisible = location.pathname === '/contacts';

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">ContactHub</span>
            </div>

            {/* Navigation links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <Badge variant="secondary" className="ml-1">
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Search and actions */}
          <div className="flex items-center space-x-4">
            {isSearchVisible && (
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4 w-64 bg-slate-50 border-slate-200 focus:bg-white h-10"
                />
              </div>
            )}

            <NavLink to="/contacts/new">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </NavLink>

            {/* User menu */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden sm:block">
                    {user.email}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile search */}
        {isSearchVisible && (
          <div className="sm:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
              <Input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 w-full bg-slate-50 border-slate-200 focus:bg-white h-10"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
