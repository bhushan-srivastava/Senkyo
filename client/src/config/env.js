const env = {
  accessTokenKey:
    process.env.REACT_APP_ACCESS_TOKEN_KEY || "etherballot_access_token",
  apiBaseUrl: (process.env.REACT_APP_API_BASE_URL || "").replace(/\/+$/, ""),
};



export { env };
