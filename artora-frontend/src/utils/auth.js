// auth — localStorage token utilities
export const saveAuth = (token, user) => {
  localStorage.setItem('artora_token', token);
  localStorage.setItem('artora_user', JSON.stringify(user));
};

export const getToken = () => {
  return localStorage.getItem('artora_token');
};

export const getUser = () => {
  const user = localStorage.getItem('artora_user');
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('artora_token');
};

export const getUserRole = () => {
  const user = getUser();
  return user ? user.role : null;
};

export const logout = () => {
  localStorage.removeItem('artora_token');
  localStorage.removeItem('artora_user');
};
