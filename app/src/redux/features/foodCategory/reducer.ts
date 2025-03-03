import foodCategoryApi from "@/services/api/food/food-categories"
import { IFoodCategoryReducerState } from "@/types/food-category"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import {
    IFoodCategory,
    IFoodCategoryCreateRequest,
    IFoodCategoryDeleteRequest,
    IFoodCategoryUpdateRequest,
} from "./../../../types/food-category"
import { reducerActions } from "./action"

export const initialState: IFoodCategoryReducerState = {
    list: [] as IFoodCategory[],
    isLoadList: false,
    item: {} as IFoodCategory,
}

export const getFoodCategories = createAsyncThunk("foodCategory/getFoodCategories", async () => {
    const { data: response } = await foodCategoryApi.fetchList()
    return response
})

export const getFoodCategory = createAsyncThunk(
    "foodCategory/getFoodCategory",
    async (id: string) => {
        const { data: response } = await foodCategoryApi.getDetail(id)
        return response
    },
)

export const updateFoodCategory = createAsyncThunk(
    "foodCategory/updateFoodCategory",
    async (payload: IFoodCategoryUpdateRequest) => {
        const { data: response } = await foodCategoryApi.update(payload)
        return response
    },
)

export const createFoodCategory = createAsyncThunk(
    "foodCategory/createFoodCategory",
    async (payload: IFoodCategoryCreateRequest) => {
        const { data: response } = await foodCategoryApi.create(payload)
        return response
    },
)

export const deleteFoodCategory = createAsyncThunk(
    "foodCategory/deleteFoodCategory",
    async (payload: IFoodCategoryDeleteRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await foodCategoryApi.delete(newPayload)
        return response
    },
)

const foodCategory = createSlice({
    name: "foodCategory",
    initialState,
    reducers: reducerActions,
    extraReducers(builder) {
        builder
            .addCase(getFoodCategories.fulfilled, (state, action) => {
                state.list = action.payload.data
                state.isLoadList = true
            })
            .addCase(getFoodCategory.fulfilled, (state, action) => {
                state.item = action.payload.data
            })
            .addCase(updateFoodCategory.fulfilled, state => {
                state.isLoadList = false
            })
            .addCase(createFoodCategory.fulfilled, state => {
                state.isLoadList = false
            })
            .addCase(deleteFoodCategory.fulfilled, state => {
                state.isLoadList = false
            })
    },
})

// Action creators are generated for each case reducer function

export const selectFoodCategories = (state: RootState) => state.foodCategory.list
export const selectFoodCategory = (state: RootState) => state.foodCategory.item
export const selectIsLoadFoodCategoryList = (state: RootState) => state.foodCategory.isLoadList

export const foodCategoryReducer = foodCategory.reducer
