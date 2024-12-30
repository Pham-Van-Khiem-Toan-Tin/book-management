const baseUrl: string = import.meta.env.VITE_REACT_APP_API_URL;

export const BORROW_ENDPOINT = {
    ALL: `${baseUrl}/admin/borrows/all`,
    CREATE: `${baseUrl}/admin/borrows/create`,
    VIEW: `${baseUrl}/admin/borrows/view`,
    EDIT: `${baseUrl}/admin/borrows/edit`,
    DELETE: `${baseUrl}/admin/borrows/delete`,
    RETURN: `${baseUrl}/admin/borrows/return`,
    USER: `${baseUrl}/admin/borrows/user`,
    BOOK: `${baseUrl}/admin/borrows/book`,
    BORROWED: `${baseUrl}/admin/borrows/borrowed`,
    BORROWED_USER: `${baseUrl}/admin/borrows/borrowed-user`,
    BORROWED_BOOK: `${baseUrl}/admin/borrows/borrowed-book`,
    BORROWED_USER_BOOK: `${baseUrl}/admin/borrows/borrowed-user-book`,
    BORROWED_USER_BOOK_RETURN: `${baseUrl}/admin/borrows/borrowed-user-book-return`,
    BORROWED_USER_RETURN: `${baseUrl}/admin/borrows/borrowed-user-return`,
    BORROWED_BOOK_RETURN: `${baseUrl}/admin/borrows/borrowed-book-return`,
    BORROWED_RETURN: `${baseUrl}/admin/borrows/borrowed-return`,
    BORROWED_USER_RETURN_BOOK: `${baseUrl}/admin/borrows/borrowed-user-return-book`,
    BORROWED_USER_BOOK_RETURN_BOOK: `${baseUrl}/admin/borrows/borrowed-user-book-return-book`,
    BORROWED_USER_RETURN_BOOK_RETURN: `${baseUrl}/admin/borrows/borrowed-user-return-book-return`,
    BORROWED_USER_BOOK_RETURN_BOOK_RETURN: `${baseUrl}/admin/borrows/borrowed-user-book-return-book-return`,
    BORROWED_USER_RETURN_BOOK_RETURN_BOOK: `${baseUrl}/admin/borrows/borrowed-user-return-book-return-book`,
    BORROWED_USER_BOOK_RETURN_BOOK_RETURN_BOOK: `${baseUrl}/admin/borrows/borrowed-user-book-return-book-return-book`,
    BORROWED_USER_RETURN_BOOK_RETURN_BOOK_RETURN: `${baseUrl}/admin/borrows/borrowed-user-return-book-return-book-return`
}