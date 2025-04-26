'use client';

import { createContext } from 'react';

import type { AuthContextValue } from '../../../../../DevWare/FeWare/src/auth/types';

// ----------------------------------------------------------------------

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
