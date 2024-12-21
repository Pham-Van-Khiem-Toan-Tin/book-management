const baseUrl: string = import.meta.env.VITE_REACT_APP_API_URL;

export const CATEGORY_ENDPOINT = {
    ALL: `${baseUrl}/admin/categories/all`,
    CREATE: `${baseUrl}/admin/categories/create`
}