import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import useAuthAxios from "../../hooks/useAuthApi";
import { BOOK_ENDPOINT } from "../endpoints/book.endpoint";

export interface Book {
  _id: string;
  title: string;
  category: {
    _id: string;
    name: string;
  }
  author: string;
  publisher: string;
  image: {
    url: string;
  };
  type: string;
  description: string;
  createdAt: string;
}

interface AllBook {
  books: Array<Book>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
interface BookSearch {
  keyword: string | null | undefined;
  page: number | null;
  view: number | null;
}
export const allBook = createAsyncThunk<AllBook, BookSearch>(
  "book/all",
  async ({ keyword, view, page }, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      let query = "";
      if (keyword) query += `?keyword=${encodeURIComponent(keyword)}`;
      if (page) query += `${query ? "&" : "?"}page=${page}`;
      if (view) query += `${query ? "&" : "?"}limit=${view}`;
      const response = await authApi.get(BOOK_ENDPOINT.ALL + query);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching user data");
    }
  }
);
