const baseUrl: string = import.meta.env.VITE_REACT_APP_API_URL;

export const USER_ENDPOINT = {
    ALL: `${baseUrl}/admin/users/all`,
    VIEW: `${baseUrl}/admin/users/view`,
    EDIT: `${baseUrl}/admin/users/edit`,
    LOCK: `${baseUrl}/admin/users/lock`
}