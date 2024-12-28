const baseUrl: string = import.meta.env.VITE_REACT_APP_API_URL;

export const SUBFUNCTION_ENDPOINT = {
    ALL: `${baseUrl}/admin/subfunctions/all`,
    COMMON: `${baseUrl}/admin/subfunctions/common/all`,
    CREATE: `${baseUrl}/admin/subfunctions/create`,
};