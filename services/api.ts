import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";

let cookies = parseCookies();

export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${cookies["nextAuthToken"]}`,
  },
});

//! 1º parametro da função: "O que eu quero fazer se a resposta der sucesso"
//! 2º parametro da função: "O que eu quero fazer se ocorrer algum erro"
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data.code === "token.expired") {
        cookies = parseCookies();

        const { nextAuthrefreshToken: refreshToken } = cookies;

        api.post("/refresh", { refreshToken }).then((response) => {
          setCookie(undefined, "nextAuthToken", response.data.token, {
            maxAge: 60 * 60 * 24 * 30,
            path: "/",
          });
          setCookie(
            undefined,
            "nextAuthrefreshToken",
            response.data.refreshToken,
            {
              maxAge: 60 * 60 * 24 * 30,
              path: "/",
            }
          );

          api.defaults.headers[
            "Authorization"
          ] = `Bearer ${response.data.token}`;
        });
      } else {
      }
    }
  }
);
