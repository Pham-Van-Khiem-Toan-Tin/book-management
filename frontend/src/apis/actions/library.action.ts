import { createAsyncThunk } from "@reduxjs/toolkit";
import useAuthAxios from "../../hooks/useAuthApi";
import { LIBRARY_ENDPOINT } from "../endpoints/library.endpoint";
import { AxiosError } from "axios";


export interface Library {
    _id: string,
    name: string,
    description: string,
    location: string,
    createdAt: string,
};

interface AllLibrary {
    libraries: Array<Library>,
    pagination: {
        total: number,
        page: number,
        limit: number,
        totalPages: number,
    }
};
export interface LibraryCommon {
    _id: string,
    name: string,
};
interface CommonLibraries {
    libraries: Array<LibraryCommon>
}
interface LibraryDetailRes {
    library: Library
};

interface LibrarySearch {
    keyword: string | null | undefined,
    page: number | null,
    view: number | null
};

interface LibraryResponse {
    success: boolean,
    message: string
};
interface LibraryForm {
    _id: string,
    name: string,
    location: string,
    description: string
};
export const allLibrary = createAsyncThunk<AllLibrary, LibrarySearch>(
    "library/all",
    async ({ keyword, view, page }, { rejectWithValue }) => {
        try {
            const authApi = useAuthAxios();
            let query = "";
            if (keyword) query += `?keyword=${encodeURIComponent(keyword)}`;
            if (page) query += `${query ? "&" : "?"}page=${page}`;
            if (view) query += `${query ? "&" : "?"}limit=${view}`;
            const response = await authApi.get(LIBRARY_ENDPOINT.ALL + query);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue("Error fetching user data");
        }
    }
);
export const allCommonLibrary = createAsyncThunk<CommonLibraries,void>(
    "library/allCommon",
    async (_, { rejectWithValue }) => {
        try {
            const authApi = useAuthAxios();
            const response = await authApi.get(LIBRARY_ENDPOINT.COMMON);
            return response.data;
        } catch (error) {
            console.log(error);

            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue("Error fetching user data");
        }
    }
);
interface LibraryFormCreate {
    name: string,
    location: string,
    description: string
};
export const createLibrary = createAsyncThunk<LibraryResponse, LibraryFormCreate>(
    "library/create",
    async (library, { rejectWithValue }) => {
        try {
            const authApi = useAuthAxios();
            const response = await authApi.post(LIBRARY_ENDPOINT.CREATE, library);
            return response.data;
        } catch (error) {
            console.log(error);

            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue("Error creating library");
        }
    }
);

export const viewLibrary = createAsyncThunk<LibraryDetailRes, string>(
    "library/view",
    async (id, { rejectWithValue }) => {
        try {
            const authApi = useAuthAxios();
            const response = await authApi.get(`${LIBRARY_ENDPOINT.VIEW}/${id}`);
            return response.data;
        } catch (error) {
            console.log(error);

            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue("Error fetching library data");
        }
    }
);

export const editLibrary = createAsyncThunk<LibraryResponse, LibraryForm>(
    "library/edit",
    async (form, { rejectWithValue }) => {
        try {
            const authApi = useAuthAxios();
            const response = await authApi.put(`${LIBRARY_ENDPOINT.EDIT}/${form._id}`, form);
            return response.data;
        } catch (error) {
            console.log(error);

            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue("Error updating library");
        }
    }
);


