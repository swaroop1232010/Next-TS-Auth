'use client';

import { createContext } from 'react';

import type { FirebaseContextType } from '../../types';

// ----------------------------------------------------------------------

export const FirebaseAuthContext = createContext({} as FirebaseContextType);
