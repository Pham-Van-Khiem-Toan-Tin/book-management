import axios, { AxiosError } from "axios";
import { AUTH_ENDPOINT } from "../apis/endpoints/auth.endpoint";

const useAuthAxios = () => {
  const token: string | null = localStorage.getItem("act");

  const authApi = axios.create({
    timeout: 5000,
  });
  if (token) {
    authApi.defaults.headers.Authorization = `Bearer ${token}`;
    authApi.interceptors.request.use(
      (config) => {
        config.withCredentials = true;
        return config;
      },
      (error) => {
        return Promise.reject(new Error(error));
      }
    );
  }
  authApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.log(error);
      
      const originalRequest = error.config;
      if (error.response.status == 403) {
          window.location.href = "/403";
          return Promise.reject(new AxiosError("Session expired"));
      }
      if (error.response.status == 498 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const renewTokenResponse = await axios.get(
            AUTH_ENDPOINT.RENEW_TOKEN,
            {
              withCredentials: true,
            }
          );
          const newAccessToken = renewTokenResponse.data.accessToken;
          localStorage.setItem("act", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return authApi(originalRequest);
        } catch (errorIntrospect) {
          console.log(errorIntrospect);
          alert("Session expired");
          localStorage.removeItem("act");
          window.location.href = "/";
          return Promise.reject(new AxiosError("Session expired"));
        }
      }
      if (error.response.status == 419) {
        localStorage.removeItem("act");
        return Promise.reject(error as AxiosError);
      }
      console.log(error);
      return Promise.reject(error as AxiosError);
    }
  );

  return authApi;
};

export default useAuthAxios;
