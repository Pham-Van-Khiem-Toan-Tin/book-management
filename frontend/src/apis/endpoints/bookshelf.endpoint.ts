const baseUrl: string = import.meta.env.VITE_REACT_APP_API_URL;
export const BOOKSHELF_ENDPOINT = {
    ALL: `${baseUrl}/admin/bookshelves/all`,
    CREATE: `${baseUrl}/admin/bookshelves/create`,
    VIEW: `${baseUrl}/admin/bookshelves/view`,
    EDIT: `${baseUrl}/admin/bookshelves/update`,
    DELETE: `${baseUrl}/admin/bookshelves/delete`,
    ADD_BOOK: `${baseUrl}/admin/bookshelves/add-book`,
}