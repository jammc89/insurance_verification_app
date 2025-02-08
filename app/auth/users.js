'use client';

// Temporary user data store (in production this would be in a secure database)
export const VALID_USERS = [
  {
    email: 'admin@example.com',
    password: 'admin123', // In production, this would be hashed
    role: 'admin'
  },
  {
    email: 'staff@example.com',
    password: 'staff123',
    role: 'staff'
  }
];
