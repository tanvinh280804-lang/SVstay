import { customerApi, TOKEN_KEYS } from "../../config/axios.config.jsx";

export const CUSTOMER_INFO_KEY = "customer_info";
const CUSTOMER_AUTH_EVENT = "svstay:customer-auth-change";

const storeSession = ({ customer, token }) => {
  if (token) localStorage.setItem(TOKEN_KEYS.CUSTOMER, token);
  if (customer) localStorage.setItem(CUSTOMER_INFO_KEY, JSON.stringify(customer));
  window.dispatchEvent(new Event(CUSTOMER_AUTH_EVENT));
};

export const customerRegister = async (payload) => {
  const response = await customerApi.post("/register", payload);
  storeSession(response || {});
  return response;
};

export const customerLogin = async (payload) => {
  const response = await customerApi.post("/login", payload);
  storeSession(response || {});
  return response;
};

export const getCustomerProfile = async () => customerApi.get("/me");

export const updateCustomerProfile = async (payload) => {
  const response = await customerApi.patch("/me", payload);
  if (response?.customer) storeSession({ customer: response.customer });
  return response;
};

export const customerLogout = () => {
  localStorage.removeItem(TOKEN_KEYS.CUSTOMER);
  localStorage.removeItem(CUSTOMER_INFO_KEY);
  window.dispatchEvent(new Event(CUSTOMER_AUTH_EVENT));
};

export const CUSTOMER_AUTH_CHANGE_EVENT = CUSTOMER_AUTH_EVENT;

export const getCurrentCustomer = () => {
  try {
    const info = localStorage.getItem(CUSTOMER_INFO_KEY);
    return info ? JSON.parse(info) : null;
  } catch {
    return null;
  }
};

export const isCustomerAuthenticated = () => Boolean(localStorage.getItem(TOKEN_KEYS.CUSTOMER));
