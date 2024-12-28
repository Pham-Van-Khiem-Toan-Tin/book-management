const baseUrl: string = import.meta.env.VITE_REACT_APP_API_URL;

export const AUTHORITY_ENDPOINT = {
    ALL: `${baseUrl}/admin/authorities/all`,
    COMMON: `${baseUrl}/admin/authorities/common/all`,
    VIEW: `${baseUrl}/admin/authorities/view`,
    EDIT: `${baseUrl}/admin/authorities/edit`,
}