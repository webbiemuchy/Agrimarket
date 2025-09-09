// frontend/src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../contexts/authContextObj';

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
