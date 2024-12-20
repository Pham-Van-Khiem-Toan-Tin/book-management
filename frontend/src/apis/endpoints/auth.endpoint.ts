const baseUrl: string = import.meta.env.VITE_REACT_APP_API_URL;

export const AUTH_ENDPOINT = {
    LOGIN_SUCCESS: `${baseUrl}/auth/login/success`,
    RENEW_TOKEN: `${baseUrl}/auth/token`,
    PROFILE_BASE: `${baseUrl}/auth/base`
}