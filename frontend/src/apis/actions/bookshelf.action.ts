import { createAsyncThunk } from "@reduxjs/toolkit";
import useAuthAxios from "../../hooks/useAuthApi";
import { BOOKSHELF_ENDPOINT } from "../endpoints/bookshelf.endpoint";
import { AxiosError } from "axios";

export interface Bookshelf {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  bookcase: {
    _id: string;
    name: string;
    library: {
      _id: string;
      name: string;
    };
  };
}

interface AllBookshelf {
  bookshelves: Array<Bookshelf>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface BookshelfDetailRes {
  bookshelf: Bookshelf;
}

interface BookshelfSearch {
  keyword: string | null | undefined;
  page: number | null;
  view: number | null;
}

interface BookshelfResponse {
  success: boolean;
  message: string;
}

interface BookshelfForm {
  _id: string;
  name: string;
  description: string;
  bookcaseId: string;
}

export const allBookshelf = createAsyncThunk<AllBookshelf, BookshelfSearch>(
  "bookshelf/all",
  async ({ keyword, view, page }, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      let query = "";
      if (keyword) query += `?keyword=${encodeURIComponent(keyword)}`;
      if (page) query += `${query ? "&" : "?"}page=${page}`;
      if (view) query += `${query ? "&" : "?"}limit=${view}`;
      const response = await authApi.get(BOOKSHELF_ENDPOINT.ALL + query);
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

interface BookshelfFormCreate {
  name: string;
  description: string;
  bookcaseId: string;
}
export const createBookshelf = createAsyncThunk<
  BookshelfResponse,
  BookshelfFormCreate
>("bookshelf/create", async (bookshelf, { rejectWithValue }) => {
  try {
    const authApi = useAuthAxios();
    const response = await authApi.post(BOOKSHELF_ENDPOINT.CREATE, bookshelf);
    return response.data;
  } catch (error) {
    console.log(error);

    if (error instanceof AxiosError && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("Error creating bookshelf");
  }
});

export const viewBookshelf = createAsyncThunk<BookshelfDetailRes, string>(
  "bookshelf/view",
  async (id, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.get(BOOKSHELF_ENDPOINT.VIEW + `/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching bookshelf data");
    }
  }
);

export const editBookshelf = createAsyncThunk<BookshelfResponse, BookshelfForm>(
  "bookshelf/edit",
  async (form, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.put(`${BOOKSHELF_ENDPOINT.EDIT}/${form._id}`, form);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error editing bookshelf");
    }
  }
);

export const deleteBookshelf = createAsyncThunk<BookshelfResponse, string>(
  "bookshelf/delete",
  async (id, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.delete(
        BOOKSHELF_ENDPOINT.DELETE + `/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error deleting bookshelf");
    }
  }
);
