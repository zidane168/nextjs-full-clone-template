import brandApi from "@/services/api/brand/brand.api"
import { IBrand, IBrandCreateRequest, IBrandState, IBrandUpdateRequest } from "@/types/brand"
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { reducerActions } from "./action"
import { IDeleteRequest, IDetailRequest, IFieldLanguage, ISelectOption } from "@/types/common"

export const initialState: IBrandState = {
    list: [] as IBrand[],
    isLoadList: false,
    item: {} as IBrand,
}

export const getBrands = createAsyncThunk("brand/getBrandsThunk", async () => {
    const { data: response } = await brandApi.fetchList()
    return response
})

export const getBrandDetail = createAsyncThunk(
    "brand/fetchBrandDetailThunk",
    async (payload: IDetailRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await brandApi.fetchBrandDetail(newPayload)
        return response
    },
)

export const updateBrand = createAsyncThunk(
    "brand/updateBrandThunk",
    async (payload: IBrandUpdateRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await brandApi.updateBrand(newPayload)
        return response
    },
)

export const createBrand = createAsyncThunk(
    "brand/createBrandThunk",
    async (payload: IBrandCreateRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await brandApi.createBrand(newPayload)
        return response
    },
)

export const deleteBrand = createAsyncThunk(
    "brand/deleteBrandThunk",
    async (payload: IDeleteRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await brandApi.deleteBrand(newPayload)
        return response
    },
)

const brand = createSlice({
    name: "brand",
    initialState,
    reducers: reducerActions,
    extraReducers(builder) {
        builder
            .addCase(getBrands.fulfilled, (state, action) => {
                state.list = action.payload.data
                state.isLoadList = true
            })
            .addCase(getBrandDetail.fulfilled, (state, action) => {
                state.item = action.payload.data
            })
            .addCase(updateBrand.fulfilled, state => {
                state.isLoadList = false
            })
            .addCase(createBrand.fulfilled, state => {
                state.isLoadList = false
            })
            .addCase(deleteBrand.fulfilled, state => {
                state.isLoadList = false
            })
    },
})

// Action creators are generated for each case reducer function

export const selectBrands = (state: RootState) => state.brand.list
export const selectIsLoadBrandList = (state: RootState) => state.brand.isLoadList
export const selectBrandDetail = (state: RootState) => state.brand.item

export const selectBrandOptions = (locale: string) =>
    createSelector([state => state.brand.list], brands =>
        brands.map((item: IBrand) => {
            return {
                label: item.name?.[locale as keyof IFieldLanguage] ?? "",
                value: item.id,
            } as ISelectOption
        }),
    )

export const brandReducer = brand.reducer
