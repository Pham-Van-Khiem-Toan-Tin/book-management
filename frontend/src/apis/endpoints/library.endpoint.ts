const baseUrl: string = import.meta.env.VITE_REACT_APP_API_URL;

export const LIBRARY_ENDPOINT = {
    ALL: `${baseUrl}/admin/libraries/all`,
    CREATE: `${baseUrl}/admin/libraries/create`,
    VIEW: `${baseUrl}/admin/libraries/view`,
    EDIT: `${baseUrl}/admin/libraries/edit`,
    DELETE: `${baseUrl}/admin/libraries/delete`,
    COMMON: `${baseUrl}/admin/libraries/common/all`
}