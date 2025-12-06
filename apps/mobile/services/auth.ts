import AsyncStorage from '@react-native-async-storage/async-storage';

const EMPLOYEE_CREDENTIALS = {
  username: 'employee',
  password: 'employee123',
};

export const login = async (username: string, password: string): Promise<boolean> => {
  if (username === EMPLOYEE_CREDENTIALS.username && password === EMPLOYEE_CREDENTIALS.password) {
    await AsyncStorage.setItem('username', username);
    return true;
  }
  return false;
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem('username');
};

export const getUsername = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('username');
};

export const isAuthenticated = async (): Promise<boolean> => {
  const username = await getUsername();
  return username !== null;
};
