import { env } from "../config/env";

const ACCESS_TOKEN_KEY = env.accessTokenKey;

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function setAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export { getAccessToken, setAccessToken, clearAccessToken };
