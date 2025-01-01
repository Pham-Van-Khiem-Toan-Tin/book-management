import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import useAuthAxios from "../../hooks/useAuthApi";
import { BOOK_ENDPOINT } from "../endpoints/book.endpoint";

export interface Book {
  _id: string;
  title: string;
  categories: [
    {
      _id: string;
      name: string;
    }
  ];
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

export interface BookSelect {
  _id: string;
  title: string;
  image: {
    url: string;
    public_id: string;
  };
}
interface BookSelectResponse {
  books: Array<BookSelect>;
}

export const selectBook = createAsyncThunk<
  BookSelectResponse,
  { keyword: string | null; excludedBookIds: string[]; categoryId: string }
>(
  "book/select",
  async ({ keyword, excludedBookIds, categoryId }, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      let query = `?categoryId=${categoryId}`;
      if (keyword) query += `&keyword=${encodeURIComponent(keyword)}`;
      if (excludedBookIds.length > 0)
        query += `${query ? "&" : "?"}excluded=${excludedBookIds.join(",")}`;
      const response = await authApi.get(BOOK_ENDPOINT.SELECT + query);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching book data");
    }
  }
);

interface BookResponse {
  success: boolean;
  message: string;
}
export const createBook = createAsyncThunk<BookResponse, FormData>(
  "book/create",
  async (data, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.post(BOOK_ENDPOINT.CREATE, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error creating book");
    }
  }
);

export interface BookOfLibrary {
  bookshelfId: string;
  code: string;
  image: string;
  bookId: string;
  bookTitle: string;
  quantity: number;
  type: string;
}
interface AllBookOfLibrary {
  books: Array<BookOfLibrary>;
}
interface BookSelected {
  bookId: string;
  bookshelfId: string;
}
interface BookOfLibrarySearch {
  keyword: string | null;
  bookSelected: Array<BookSelected>;
  libraryId: string;
}
export const allBookOfLibrary = createAsyncThunk<
  AllBookOfLibrary,
  BookOfLibrarySearch
>("book/allLibrary", async (data, { rejectWithValue }) => {
  try {
    const authApi = useAuthAxios();
    const response = await authApi.post(BOOK_ENDPOINT.ALL_BOOK_LIBRARY, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("Error fetching user data");
  }
});
interface BookDetail {
  book: Book;
}
export const viewBook = createAsyncThunk<BookDetail, string>(
  "book/view",
  async (id, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.get(`${BOOK_ENDPOINT.VIEW}/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching book data");
    }
  }
);

export const editBook = createAsyncThunk<
  BookResponse,
  { id: string; data: FormData }
>("book/edit", async (data, { rejectWithValue }) => {
  try {
    const authApi = useAuthAxios();
    const response = await authApi.put(
      `${BOOK_ENDPOINT.EDIT}/${data.id}`,
      data.data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("Error editing book");
  }
});
