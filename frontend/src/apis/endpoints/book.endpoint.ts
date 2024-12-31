const baseUrl: string = import.meta.env.VITE_REACT_APP_API_URL;

export const BOOK_ENDPOINT = {
    ALL: `${baseUrl}/admin/books/all`,
    CREATE: `${baseUrl}/admin/books/create`,
    VIEW: `${baseUrl}/admin/books/view`,
    EDIT: `${baseUrl}/admin/books/edit`,
    DELETE: `${baseUrl}/admin/books/delete`,
    COMMON: `${baseUrl}/admin/books/common/all`,
    SELECT: `${baseUrl}/admin/books/select/all`,
    ALL_BOOK_LIBRARY: `${baseUrl}/admin/books/library`,
}