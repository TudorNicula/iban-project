import { createContext } from 'react';

export type AuthContextType = {
  token: string | null;
  role: string | null;
  assignedRaion: string | null;
  setToken: (token: string | null) => void;
};



export const AuthContext = createContext<AuthContextType | undefined>(undefined);
