import { AxiosError } from "axios";
import useAuthAxios from "../../hooks/useAuthApi";
import { SUBFUNCTION_ENDPOINT } from "../endpoints/subfunction.endpoint";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface SubFunctionCommon {
  _id: string;
  name: string;
}
export interface SubFunction {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface AllSubFunction {
    subfunctions: Array<SubFunction>;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    }
interface SubFunctionSearch {
    keyword: string | null | undefined;
    page: number | null;
    view: number | null;
}

interface SubFunctionCommonResponse {
    functions: Array<SubFunctionCommon>;
}
interface SubFunctionResponse {
    success: boolean;
    message: string;
}
export const allSubFunctions = createAsyncThunk<AllSubFunction, SubFunctionSearch>(
    "subfunctions/all",
    async ({keyword, view, page}, { rejectWithValue }) => {
        try {
            const authApi = useAuthAxios();
            let query = "";
            if (keyword) query += `?keyword=${encodeURIComponent(keyword)}`;
            if (page) query += `${query ? "&" : "?"}page=${page}`;
            if (view) query += `${query ? "&" : "?"}limit=${view}`;
            const response = await authApi.get(SUBFUNCTION_ENDPOINT.ALL + query);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue("Error fetching functions");
        }
    }
);

export const SubFunctionCommon = createAsyncThunk<SubFunctionCommonResponse, void>(
    "subfunctions/common",
    async (_, { rejectWithValue }) => {
        try {
            const authApi = useAuthAxios();
            const response = await authApi.get(`${SUBFUNCTION_ENDPOINT.COMMON}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue("Error fetching functions");
        }
    }
);
interface SubFunctionForm {
    id: string,
    name: string,
    description: string
}
export const createSubFunction = createAsyncThunk<SubFunctionResponse, SubFunctionForm>(
    "subfunctions/create",
    async (subfunction, { rejectWithValue }) => {
        try {
            const authApi = useAuthAxios();
            const response = await authApi.post(SUBFUNCTION_ENDPOINT.CREATE, subfunction);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue("Error creating subfunction");
        }
    }
);
