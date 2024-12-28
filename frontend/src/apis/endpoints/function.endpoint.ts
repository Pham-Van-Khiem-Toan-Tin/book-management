const baseUrl: string = import.meta.env.VITE_REACT_APP_API_URL;

export const FUNCTION_ENDPOINT = {
    ALL: `${baseUrl}/admin/functions/all`,
    COMMON: `${baseUrl}/admin/functions/common/all`,
    VIEW: `${baseUrl}/admin/functions/view`,
};