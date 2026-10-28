import axios from "axios";
import { clearAuth, getAuthToken } from "./auth";

const apiHost = window.location.hostname || "127.0.0.1";
const GET_CACHE_TTL = 20_000;
const getCache = new Map();
const pendingGets = new Map();
let cacheGeneration = 0;

export function invalidateApiCache(...urls) {
  cacheGeneration += 1;
  if (!urls.length) {
    getCache.clear();
    pendingGets.clear();
    return;
  }

  urls.forEach((url) => {
    const keySuffix = `::${url}`;
    for (const key of getCache.keys()) {
      if (key.endsWith(keySuffix)) getCache.delete(key);
    }
    for (const key of pendingGets.keys()) {
      if (key.endsWith(keySuffix)) pendingGets.delete(key);
    }
  });
}

export function getCached(url, ttl = GET_CACHE_TTL) {
  const cacheKey = `${getAuthToken() || "anonymous"}::${url}`;
  const cached = getCache.get(cacheKey);
  if (cached && Date.now() - cached.cachedAt < ttl) {
    return Promise.resolve(cached.response);
  }

  const pending = pendingGets.get(cacheKey);
  if (pending) return pending;

  const generation = cacheGeneration;
  const request = api.get(url)
    .then((response) => {
      if (generation === cacheGeneration) {
        getCache.set(cacheKey, { response, cachedAt: Date.now() });
      }
      return response;
    })
    .finally(() => {
      if (pendingGets.get(cacheKey) === request) pendingGets.delete(cacheKey);
    });

  pendingGets.set(cacheKey, request);
  return request;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://${apiHost}:8000/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    const url = response.config.url || "";

    if (method && method !== "get") {
      if (url === "/bookings" || url.startsWith("/bookings/")) {
        invalidateApiCache("/bookings", "/dashboard", "/admin/notifications", "/admin/customers");
      } else if (url.includes("/courts")) {
        invalidateApiCache("/courts", "/dashboard");
      }
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
    }
    return Promise.reject(error);
  }
);

export default api;
