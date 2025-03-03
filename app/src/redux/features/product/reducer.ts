import productApi from "@/services/api/product/product.api"
import { IChangeStatusRequest } from "@/types/common"
import {
    IChickenPotProductCreate,
    IChickenPotProductDetail,
    IChickenPotProductUpdate,
} from "@/types/product"
import { PAGINATION_DEFAULT } from "@/utils/constants"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { reducerActions } from "./action"

export const initialState: any = {
    list: [] as IChickenPotProductDetail[],
    pagination: PAGINATION_DEFAULT,
    item: {} as IChickenPotProductDetail,
    dataList: [] as IChickenPotProductDetail[],
    isLoadDataList: false,
}

export const getProducts = createAsyncThunk(
    "product/fetchProductsThunk",
    async (data: Record<string, string>) => {
        const { data: response } = await productApi.fetchList(data)
        return response
    },
)

export const getProduct = createAsyncThunk("product/fetchProductThunk", async (id: string) => {
    const { data: response } = await productApi.getDetail(id)
    return response
})

export const updateProduct = createAsyncThunk(
    "product/updateProductThunk",
    async (payload: IChickenPotProductUpdate) => {
        const { data: response } = await productApi.update(payload)
        return response
    },
)

export const createProduct = createAsyncThunk(
    "product/createProductThunk",
    async (payload: IChickenPotProductCreate) => {
        const { data: response } = await productApi.create(payload)
        return response
    },
)

export const changeStatusProduct = createAsyncThunk(
    "product/changeStatusProductThunk",
    async (payload: IChangeStatusRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await productApi.changeStatus(newPayload)
        return response
    },
)

export const getProductDatas = createAsyncThunk(
    "product/fetchProductDatasThunk",
    async (data: Record<string, string>) => {
        const { data: response } = await productApi.fetchListData({
            ...data,
            orderBy: data?.orderBy ?? "name",
        })
        return response
    },
)

const product = createSlice({
    name: "product",
    initialState,
    reducers: reducerActions,
    extraReducers(builder) {
        builder
            .addCase(getProducts.fulfilled, (state, action) => {
                state.list = action.payload.data
                state.pagination = action.payload?._metadata?.pagination ?? {}
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.item = action.payload.data
            })
            .addCase(getProductDatas.fulfilled, (state, action) => {
                state.dataList = action.payload.data
                state.isLoadDataList = true
            })
            .addCase(createProduct.fulfilled, state => {
                state.isLoadDataList = false
            })
            .addCase(updateProduct.fulfilled, state => {
                state.isLoadDataList = false
            })
            .addCase(changeStatusProduct.fulfilled, state => {
                state.isLoadDataList = false
            })
    },
})

// Action creators are generated for each case reducer function
export const selectProducts = (state: RootState) => state.product.list
export const selectProduct = (state: RootState) => state.product.item
export const selectProductPaginations = (state: RootState) => state.product.pagination

export const selectIsLoadProductDataList = (state: RootState) => state.product.isLoadDataList

// export const selectProductDatas = (locale: string, type?: PRODUCT_TYPE | PRODUCT_TYPE[]) =>
//     createSelector([state => state.product.dataList], productList => {
//         const data = productList
//             .filter((product: any) =>
//                 type
//                     ? Array.isArray(type)
//                         ? type.includes(product.type)
//                         : product.type === type
//                     : true,
//             )
//             .map((product: any) => {
//                 return {
//                     label: product.name?.[locale as keyof IFieldLanguage] ?? "",
//                     value: product.id,
//                     type: product.type,
//                 } as ISelectOption
//             })
//         return data
//     })
export const productReducer = product.reducer
