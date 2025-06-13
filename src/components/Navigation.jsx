
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Users, Home, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './ThemeToggle';

const Navigation = ({ contactCount, searchQuery, onSearchChange }) => {
  const location = useLocation();
  
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
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">ContactHub</span>
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
                        ? 'bg-primary/10 text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
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

          {/* Search and theme toggle */}
          <div className="flex items-center space-x-4">
            {isSearchVisible && (
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 w-64 bg-background border-input focus:bg-background"
                />
              </div>
            )}

            <ThemeToggle />
          </div>
        </div>

        {/* Mobile search */}
        {isSearchVisible && (
          <div className="sm:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-full bg-background border-input focus:bg-background"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
