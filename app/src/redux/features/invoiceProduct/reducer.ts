import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { reducerActions } from "./action"
import { IChangeStatusInvoiceRequest, IDetailRequest } from "@/types/common"
import {
    IInvoiceProductState,
    IInvoiceProduct,
    IInvoiceProductDetail
} from "@/types/invoiceProduct"
import { PAGINATION_DEFAULT } from "@/utils/constants"
import invoiceProductApi from "@/services/api/invoice/invoiceProduct.api"

export const initialState: IInvoiceProductState = {
    list: [] as IInvoiceProduct[],
    pagination: PAGINATION_DEFAULT,
    item: {} as IInvoiceProductDetail,
}

export const getInvoiceProduct = createAsyncThunk(
    "invoiceProduct/fetchInvoiceProductThunk",
    async (data: Record<string, string>) => {
        const { data: response } = await invoiceProductApi.fetchProductInvoices(data)
        return response
    },
)

export const getInvoiceProductDetail = createAsyncThunk(
    "invoiceProduct/fetchInvoiceProductDetailThunk",
    async (payload: IDetailRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await invoiceProductApi.fetchProductInvoiceDetail(newPayload)
        return response
    },
)

export const changeStatusInvoiceProduct = createAsyncThunk('invoiceProduct/changeStatusInvoiceProductThunk', async (payload: IChangeStatusInvoiceRequest) => {
    const newPayload = { ...payload };
    const { data: response } = await invoiceProductApi.changeStatus(newPayload);
    return response;
  })

const invoiceProduct = createSlice({
    name: "invoiceProduct",
    initialState,
    reducers: reducerActions,
    extraReducers(builder) {
        builder
            //Fetch MnvoiceProduct list
            .addCase(getInvoiceProduct.fulfilled, (state, action) => {
                state.list = action.payload.data
                state.pagination = action.payload?._metadata?.pagination ?? {}
            })
            .addCase(getInvoiceProductDetail.fulfilled, (state, action) => {
                state.item = action.payload.data
            })
    },
})

// Action creators are generated for each case reducer function
export const selectInvoiceProduct = (state: RootState) => state.invoiceProduct.list
export const selectInvoiceProductPaginations = (state: RootState) => state.invoiceProduct.pagination
export const selectInvoiceProductDetail = (state: RootState) => state.invoiceProduct.item

// export const { } = InvoiceProduct.actions;
export const invoiceProductReducer = invoiceProduct.reducer
