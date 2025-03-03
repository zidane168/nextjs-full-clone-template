import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { reducerActions } from "./action"
import {
    IProductCategory,
    IProductCategoryDetail,
    IProductCategoryRequest,
    IProductCategoryState,
    IProductCategoryUpdate,
} from "@/types/productCategory"
import { IDeleteRequest } from "@/types/common"
import productCategoryApi from "@/services/api/product/productCategory.api"

export const initialState: IProductCategoryState = {
    list: [] as IProductCategory[],
    isLoadList: false,
    item: {} as IProductCategoryDetail,
}

export const getProductCategories = createAsyncThunk(
    "productCategory/getProductCategoriesThunk",
    async () => {
        const { data: response } = await productCategoryApi.fetchList()
        return response
    },
)

export const getProductCategory = createAsyncThunk(
    "productCategory/getProductCategoryThunk",
    async (id: string) => {
        const { data: response } = await productCategoryApi.getDetail(id)
        return response
    },
)

export const updateProductCategory = createAsyncThunk(
    "productCategory/updateProductCategoryThunk",
    async (payload: IProductCategoryUpdate) => {
        const { data: response } = await productCategoryApi.update(payload)
        return response
    },
)

export const createProductCategory = createAsyncThunk(
    "productCategory/createProductCategoryThunk",
    async (payload: IProductCategoryRequest) => {
        const { data: response } = await productCategoryApi.create(payload)
        return response
    },
)

export const deleteProductCategory = createAsyncThunk(
    "productCategory/deleteProductCategoryThunk",
    async (payload: IDeleteRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await productCategoryApi.delete(newPayload)
        return response
    },
)

const productCategory = createSlice({
    name: "productCategory",
    initialState,
    reducers: reducerActions,
    extraReducers(builder) {
        builder
            .addCase(getProductCategories.fulfilled, (state, action) => {
                state.list = action.payload.data
                state.isLoadList = true
            })
            .addCase(getProductCategory.fulfilled, (state, action) => {
                state.item = action.payload.data
            })
            .addCase(updateProductCategory.fulfilled, state => {
                state.isLoadList = false
            })
            .addCase(createProductCategory.fulfilled, state => {
                state.isLoadList = false
            })
            .addCase(deleteProductCategory.fulfilled, state => {
                state.isLoadList = false
            })
    },
})

// Action creators are generated for each case reducer function

export const selectProductCategories = (state: RootState) => state.productCategory.list
export const selectProductCategory = (state: RootState) => state.productCategory.item
export const selectIsLoadList = (state: RootState) => state.productCategory.isLoadList

export const productCategoryReducer = productCategory.reducer
