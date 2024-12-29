import { createAsyncThunk } from "@reduxjs/toolkit";
import useAuthAxios from "../../hooks/useAuthApi";
import { BOOKCASE_ENDPOINT } from "../endpoints/bookcase.endpoint";
import { AxiosError } from "axios";

export interface Bookcase {
  _id: string;
  code: string;
  name: string;
  description: string;
  library: {
    _id: string;
    name: string;
  };
  createdAt: string;
}
export interface Library {
  _id: string;
  name: string;
}
interface AllBookcase {
  bookcases: Array<Bookcase>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export interface CommonBookcase {
  _id: string;
  code: string;
  name: string;
  library: {
    _id: string;
    name: string;
  };
}
interface AllCommonBookcase {
  bookcases: Array<CommonBookcase>;
}

interface BookcaseDetailRes {
  bookcase: Bookcase;
}

interface BookcaseSearch {
  keyword: string | null | undefined;
  page: number | null;
  view: number | null;
}

interface BookcaseResponse {
  success: boolean;
  message: string;
}

interface BookcaseForm {
  _id: string;
  id: string;
  name: string;
  libraryId: string;
  description: string;
}

export const allBookcase = createAsyncThunk<AllBookcase, BookcaseSearch>(
  "bookcase/all",
  async ({ keyword, view, page }, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      let query = "";
      if (keyword) query += `?keyword=${encodeURIComponent(keyword)}`;
      if (page) query += `${query ? "&" : "?"}page=${page}`;
      if (view) query += `${query ? "&" : "?"}limit=${view}`;
      const response = await authApi.get(BOOKCASE_ENDPOINT.ALL + query);
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
export const allCommonBookcase = createAsyncThunk<AllCommonBookcase, void>(
  "bookcase/allCommon",
  async (_, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.get(BOOKCASE_ENDPOINT.COMMON);
      return response.data;
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching common bookcase data");
    }
  }
);
interface BookcaseFormCreate {
  id: string;
  name: string;
  libraryId: string;
  description: string;
}
export const createBookcase = createAsyncThunk<
  BookcaseResponse,
  BookcaseFormCreate
>("bookcase/create", async (data, { rejectWithValue }) => {
  try {
    const authApi = useAuthAxios();
    const response = await authApi.post(BOOKCASE_ENDPOINT.CREATE, data);
    return response.data;
  } catch (error) {
    console.log(error);

    if (error instanceof AxiosError && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("Error creating bookcase");
  }
});

export const viewBookcase = createAsyncThunk<BookcaseDetailRes, string>(
  "bookcase/view",
  async (id, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.get(BOOKCASE_ENDPOINT.VIEW + `/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching bookcase data");
    }
  }
);

export const editBookcase = createAsyncThunk<BookcaseResponse, BookcaseForm>(
  "bookcase/edit",
  async (data, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.put(
        `${BOOKCASE_ENDPOINT.EDIT}/${data._id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error updating bookcase");
    }
  }
);

export const deleteBookcase = createAsyncThunk<BookcaseResponse, string>(
  "bookcase/delete",
  async (id, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.delete(
        BOOKCASE_ENDPOINT.DELETE + `/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error deleting bookcase");
    }
  }
);
