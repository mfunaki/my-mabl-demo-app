import { LoginCredentials, User } from './types';

const MANAGER_CREDENTIALS = {
  username: 'manager',
  password: 'manager123',
};

export const login = (credentials: LoginCredentials): User | null => {
  if (
    credentials.username === MANAGER_CREDENTIALS.username &&
    credentials.password === MANAGER_CREDENTIALS.password
  ) {
    const user: User = {
      username: credentials.username,
      role: 'manager',
    };
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user', JSON.stringify(user));
    }
    return user;
  }
  return null;
};

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('user');
  }
};

export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return getUser() !== null;
};
