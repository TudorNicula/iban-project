import { useState, ReactNode, useEffect } from 'react';
import { AuthContext, AuthContextType } from '../context/AuthContext';
import { getUserRoleFromToken, getUserRaionFromToken } from '../utils/jwt';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(token ? getUserRoleFromToken(token) : null);
  const [assignedRaion, setAssignedRaion] = useState<string | null>(
    token ? getUserRaionFromToken(token) : null
  );

  const updateToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setRole(getUserRoleFromToken(newToken));
      setAssignedRaion(getUserRaionFromToken(newToken));
    } else {
      localStorage.removeItem('token');
      setRole(null);
      setAssignedRaion(null);
    }
    setTokenState(newToken);
  };

  useEffect(() => {
    if (token) {
      setRole(getUserRoleFromToken(token));
      setAssignedRaion(getUserRaionFromToken(token));
    }
  }, [token]);

  const value: AuthContextType = {
    token,
    setToken: updateToken,
    role,
    assignedRaion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
