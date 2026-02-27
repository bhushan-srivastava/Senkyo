const env = {
  accessTokenKey:
    process.env.REACT_APP_ACCESS_TOKEN_KEY || "etherballot_access_token",
  apiBaseUrl: (process.env.REACT_APP_API_BASE_URL || "").replace(/\/+$/, ""),
};

function buildApiUrl(path) {
  if (!path) return env.apiBaseUrl;
  if (/^https?:\/\//i.test(path)) return path;
  if (!env.apiBaseUrl) return path;
  return `${env.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export { env, buildApiUrl };
