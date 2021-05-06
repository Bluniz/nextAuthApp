import { createContext, ReactNode, useState, useEffect } from "react";
import Router from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { api } from "../services/api";

type UserProps = {
  email: string;
  roles: string[];
  permissions: string[];
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: UserProps;
};

export const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
};

export function signOut() {
  destroyCookie(undefined, "nextAuthToken");
  destroyCookie(undefined, "nextAuthrefreshToken");

  Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { nextAuthToken: token } = parseCookies();

    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { roles, permissions, email } = response.data;

          setUser({ roles, permissions, email });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("sessions", { email, password });

      const { roles, permissions, token, refreshToken } = response.data;

      //! 1º parametro é o contexto, porém isso serve apenas server side, no clientSide coloca undefined
      //! 2º parametro é o nome do cookie
      //! 3º parametro é o valor que quer armazenas
      //! 4º parametro são opções adicionais desde tempo de expiração e acesso por rota.
      setCookie(undefined, "nextAuthToken", token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      setCookie(undefined, "nextAuthrefreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      setUser({
        email,
        roles,
        permissions,
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
