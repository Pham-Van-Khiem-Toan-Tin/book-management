const baseUrl: string = import.meta.env.VITE_REACT_APP_API_URL;

export const CATEGORY_ENDPOINT = {
    ALL: `${baseUrl}/admin/categories/all`,
    CREATE: `${baseUrl}/admin/categories/create`,
    VIEW: `${baseUrl}/admin/categories/view`,
    EDIT: `${baseUrl}/admin/categories/edit`,
    DELETE: `${baseUrl}/admin/categories/delete`
}