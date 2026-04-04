export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // Ensure we always send cookies for authentication.
  const fetchOptions = {
    ...options,
    credentials: "include" as RequestCredentials,
  };

  let response = await fetch(url, fetchOptions);

  if (response.status === 401) {
    // Access token expired, attempt to refresh
    const refreshResponse = await fetch("http://localhost:3001/api/v1/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem("token", data.access_token);
      
      // Retry the original request with the new access token
      const newOptions = {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          Authorization: `Bearer ${data.access_token}`
        }
      };
      response = await fetch(url, newOptions);
    } else {
      // Refresh failed (refresh token expired or invalid), force logout
      localStorage.removeItem("token");
      window.location.href = "/"; // Or however you want to handle redirects
    }
  }

  return response;
};
