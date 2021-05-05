import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue = [];

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
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;
          api
            .post("/refresh", { refreshToken })
            .then((response) => {
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

              failedRequestsQueue.forEach((request) =>
                request.onSucess(response.data.token)
              );
              failedRequestsQueue = [];
            })
            .catch((error) => {
              failedRequestsQueue.forEach((request) =>
                request.onFailure(error)
              );
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSucess: (token: string) => {
              originalConfig.headers["Authorization"] = `Bearer ${token}`;

              resolve(api(originalConfig));
            },
            onFailure: (error: AxiosError) => {
              reject(error);
            },
          });
        });
      }
    }
  }
);
