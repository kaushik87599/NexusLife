import { API_BASE_URL } from "@/lib/config";

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  // Ensure we always send cookies for authentication and include Bearer token if available.
  const fetchOptions = {
    ...options,
    credentials: "include" as RequestCredentials,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  let response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (error) {
    console.error("Initial fetch failed:", error);
    throw error;
  }

  if (response.status === 401) {
    // Access token expired or missing, attempt to refresh
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
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
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);
      localStorage.removeItem("token");
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      throw refreshError;
    }
  }

  return response;
};
