const baseUrl: string = import.meta.env.VITE_REACT_APP_API_URL;

export const BOOKCASE_ENDPOINT = {
    ALL: `${baseUrl}/admin/bookcases/all`,
    CREATE: `${baseUrl}/admin/bookcases/create`,
    VIEW: `${baseUrl}/admin/bookcases/view`,
    EDIT: `${baseUrl}/admin/bookcases/edit`,
    DELETE: `${baseUrl}/admin/bookcases/delete`,
    COMMON: `${baseUrl}/admin/bookcases/common/all`,
}