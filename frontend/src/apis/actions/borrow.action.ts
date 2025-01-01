import { createAsyncThunk } from "@reduxjs/toolkit";
import useAuthAxios from "../../hooks/useAuthApi";
import { BORROW_ENDPOINT } from "../endpoints/borrow.endpoint";
import { AxiosError } from "axios";

export interface Borrow {
  _id: string;
  book: {
    _id: string;
    title: string;
    image: {
      url: string;
    };
  };
  code: string;
  borrower: {
    user: {
      _id: string;
      name: string
    }
    email: string;
    phone: string;
  };
  library: {
    _id: string;
    name: string;
  };
  quantity: number;
  type: string;
  borrow_date: string;
  return_date: string;
  status: string;
}
interface AllBorrow {
  borrows: Array<Borrow>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
interface BorrowSearch {
  keyword: string | null | undefined;
  page: number | null;
  view: number | null;
}
export const allBorrow = createAsyncThunk<AllBorrow, BorrowSearch>(
  "borrow/all",
  async ({ keyword, view, page }, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      let query = "";
      if (keyword) query += `?keyword=${encodeURIComponent(keyword)}`;
      if (page) query += `${query ? "&" : "?"}page=${page}`;
      if (view) query += `${query ? "&" : "?"}limit=${view}`;
      const response = await authApi.get(BORROW_ENDPOINT.ALL + query);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching borrowed books");
    }
  }
);
interface BorrowCreateForm {
  userId: string;
  email: string;
  phone: string;
  books: Array<{
    id: string;
    code: string;
    quantity: number;
    returnDate: Date;
    bookshelf: string;
    library: string;
  }>;
}
interface BorrowResponse {
  success: boolean;
  message: string;
}
export const createBorrowOffline = createAsyncThunk<
  BorrowResponse,
  BorrowCreateForm
>("borrow/create-offline", async (data, { rejectWithValue }) => {
  try {
    const authApi = useAuthAxios();
    const response = await authApi.post(BORROW_ENDPOINT.CREATE_OFFLINE, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("Error fetching borrowed books");
  }
});
