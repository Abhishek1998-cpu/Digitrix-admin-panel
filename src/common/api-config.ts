import axios from "axios";
import { default as Cookie } from "js-cookie";
import { API_ROOT } from "./env";

interface Optional {
  headers?: object;
  params?: object;
}

const defaultOptional: Optional = {
  headers: {},
  params: {},
};

axios.defaults.withCredentials = true;

const getHeaders = (headers = {}) => {
  const token = Cookie.get("x-engage-panel-access-token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    credentials: "include",
    ...headers,
  };
};

const axiosConfig = axios.create({
  baseURL: API_ROOT,
});

axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error -> ", error);
    if (error?.response && error?.response?.status === 401) {
      // Don't redirect if we're already on the login page to prevent infinite loops
      if (window && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  head: <T>(url: string, opt = defaultOptional) =>
    axiosConfig.head<T>(url, {
      headers: getHeaders(opt.headers),
      params: opt.params,
    }),
  get: <T>(url: string, opt = defaultOptional) =>
    axiosConfig.get<T>(url, {
      headers: getHeaders(opt.headers),
      params: opt.params,
    }),
  post: <T>(url: string, data: any, opt = defaultOptional) =>
    axiosConfig.post<T>(url, data, {
      headers: getHeaders(opt.headers),
      params: opt.params,
    }),
  patch: <T>(url: string, data: any, opt = defaultOptional) =>
    axiosConfig.patch<T>(url, data, {
      headers: getHeaders(opt.headers),
      params: opt.params,
    }),
  put: <T>(url: string, data: any, opt = defaultOptional) =>
    axiosConfig.put<T>(url, data, {
      headers: getHeaders(opt.headers),
      params: opt.params,
    }),
  delete: <T>(url: string, data: any, opt = defaultOptional) =>
    axiosConfig.delete<T>(url, {
      headers: getHeaders(opt.headers),
      params: opt.params,
      data: data,
    }),
};
