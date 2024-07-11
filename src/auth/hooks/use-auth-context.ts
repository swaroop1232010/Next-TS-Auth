'use client';

import { useContext } from 'react';

// import { AuthContext } from '../context/auth-context';
import { FirebaseAuthContext } from '../context/firebase/firebase-auth-context';

// ----------------------------------------------------------------------

/*
 * JWT authentication
 */

/*
export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext: Context must be used inside AuthProvider');
  }
  
  return context;
}
*/

/*
 * Firebase authentication
 */
export function useAuthContext() {
  const context = useContext(FirebaseAuthContext);

  if (!context) {
    throw new Error('useAuthContext: Context must be used inside AuthProvider');
  }

  return context;
}
