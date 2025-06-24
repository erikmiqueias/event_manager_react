import { useState, useEffect } from "react";

type AuthState = {
  isAuthenticated: boolean | null;
  userId: string;
};

const useAuthentication = () => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: null,
    userId: "",
  });

  useEffect(() => {
    const fetchAuthentication = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/auth/status`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setAuth({
            isAuthenticated: data.authenticated,
            userId: data.user.id,
          });
        } else {
          setAuth({ isAuthenticated: false, userId: "" });
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setAuth({ isAuthenticated: false, userId: "" });
      }
    };

    fetchAuthentication();
  }, []);

  return auth;
};

export default useAuthentication;
