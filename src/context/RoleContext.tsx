/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserRole, User, Notification } from '../types';
import { hosts, drivers, notifications as mockNotifications } from '../data/mockData';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: User | null;
  switchUser: (id: string) => void;
  userNotifications: Notification[];
  markAllAsRead: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(UserRole.DRIVER);
  const [currentUser, setCurrentUser] = useState<User | null>(drivers[0]);
  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);

  // Update local notifications state when user changes
  useEffect(() => {
    if (currentUser) {
      const filtered = mockNotifications.filter(n => n.userId === currentUser.id);
      setUserNotifications(filtered);
    }
  }, [currentUser]);

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === UserRole.DRIVER) {
      setCurrentUser(drivers[0]);
    } else if (newRole === UserRole.HOST) {
      setCurrentUser(hosts[0]);
    } else {
      // Admin
      const adminUser = {
        id: "admin-1",
        name: "Admin ParkLuar",
        email: "admin@parkluar.my",
        phone: "+60123456789",
        avatar: "https://i.pravatar.cc/150?u=admin",
        role: UserRole.ADMIN,
        joinedAt: new Date().toISOString(),
      };
      setCurrentUser(adminUser);
    }
  };

  const markAllAsRead = () => {
    setUserNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const switchUser = (id: string) => {
    const user = [...drivers, ...hosts].find(u => u.id === id);
    if (user) {
      setCurrentUser(user);
      setRole(user.role);
    }
  };

  return (
    <RoleContext.Provider value={{ 
      role, 
      setRole: handleSetRole, 
      currentUser, 
      switchUser, 
      userNotifications,
      markAllAsRead
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within a RoleProvider');
  return context;
};
