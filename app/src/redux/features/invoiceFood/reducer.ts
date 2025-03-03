import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { reducerActions } from "./action"
import { IChangeStatusInvoiceRequest, IDetailRequest } from "@/types/common"
import {
    IInvoiceFoodState,
    IInvoiceFood,IInvoiceFoodDetail
} from "@/types/invoiceFood"
import { PAGINATION_DEFAULT } from "@/utils/constants"
import invoiceFoodApi from "@/services/api/invoice/invoiceFood.api"

export const initialState: IInvoiceFoodState = {
    list: [] as IInvoiceFood[],
    pagination: PAGINATION_DEFAULT,
    item: {} as IInvoiceFoodDetail,
}

export const getInvoiceFood = createAsyncThunk(
    "invoiceFood/fetchInvoiceFoodThunk",
    async (data: Record<string, string>) => {
        const { data: response } = await invoiceFoodApi.fetchFoodInvoices(data)
        return response
    },
)

export const getInvoiceFoodDetail = createAsyncThunk(
    "invoiceFood/fetchInvoiceFoodDetailThunk",
    async (payload: IDetailRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await invoiceFoodApi.fetchFoodInvoiceDetail(newPayload)
        return response
    },
)

export const changeStatusInvoiceFood = createAsyncThunk('invoiceFood/changeStatusInvoiceFoodThunk', async (payload: IChangeStatusInvoiceRequest) => {
    const newPayload = { ...payload };
    const { data: response } = await invoiceFoodApi.changeStatus(newPayload);
    return response;
  })

export const exportInvoiceFood = createAsyncThunk("invoiceFood/exportInvoiceFoodThunk",
    async (data?: Record<string, string>) => {
        const { data: response } = await invoiceFoodApi.export(data)
        return response
    },
  )

const invoiceFood = createSlice({
    name: "invoiceFood",
    initialState,
    reducers: reducerActions,
    extraReducers(builder) {
        builder
            //Fetch MnvoiceFood list
            .addCase(getInvoiceFood.fulfilled, (state, action) => {
                state.list = action.payload.data
                state.pagination = action.payload?._metadata?.pagination ?? {}
            })
            .addCase(getInvoiceFoodDetail.fulfilled, (state, action) => {
                state.item = action.payload.data
            })
    },
})

// Action creators are generated for each case reducer function
export const selectInvoiceFood = (state: RootState) => state.invoiceFood.list
export const selectInvoiceFoodPaginations = (state: RootState) => state.invoiceFood.pagination
export const selectInvoiceFoodDetail = (state: RootState) => state.invoiceFood.item

// export const { } = InvoiceFood.actions;
export const invoiceFoodReducer = invoiceFood.reducer
