const TOKEN_KEY = "token";
const USER_KEY = "user";

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function getAuthUser() {
  const storedUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    clearAuth();
    return null;
  }
}

export function saveAuth({ token, user }, remember = false) {
  clearAuth();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function getApiErrorMessage(error, fallback) {
  const data = error?.response?.data;
  const validationMessage = data?.errors
    ? Object.values(data.errors).flat().find((message) => typeof message === "string")
    : null;

  return validationMessage || data?.message || fallback;
}
