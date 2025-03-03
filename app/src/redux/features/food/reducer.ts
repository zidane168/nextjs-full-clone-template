import foodApi from "@/services/api/food/food"
import {
    IFood,
    IFoodCreateRequest,
    IFoodDeleteRequest,
    IFoodReducerState,
    IFoodUpdateRequest,
} from "@/types/food"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { reducerActions } from "./action"
import { PAGINATION_DEFAULT } from "@/utils/constants"

export const initialState: IFoodReducerState = {
    list: [] as IFood[],
    isLoadList: false,
    pagination: PAGINATION_DEFAULT,
    item: {} as IFood,
}

export const getFoods = createAsyncThunk("foods/getFoods", async (data: Record<string,string>) => {
    const { data: response } = await foodApi.fetchList(data)
    return response
})

export const getFood = createAsyncThunk("foods/getFood", async (id: string) => {
    const { data: response } = await foodApi.getDetail(id)

    return response
})

export const updateFood = createAsyncThunk(
    "foods/updateFood",
    async (payload: IFoodUpdateRequest) => {
        const { data: response } = await foodApi.update(payload)
        return response
    },
)

export const createFood = createAsyncThunk(
    "foods/createFood",
    async (payload: IFoodCreateRequest) => {
        const { data: response } = await foodApi.create(payload)
        return response
    },
)

export const deleteFood = createAsyncThunk(
    "foods/deleteFood",
    async (payload: IFoodDeleteRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await foodApi.delete(newPayload)
        return response
    },
)

const food = createSlice({
    name: "food",
    initialState,
    reducers: reducerActions,
    extraReducers(builder) {
        builder
            .addCase(getFoods.fulfilled, (state, action) => {
                state.list = action.payload.data
                state.isLoadList = true
                state.pagination = action.payload?._metadata?.pagination ?? {};
            })
            .addCase(getFood.fulfilled, (state, action) => {
                state.item = action.payload.data
            })
            .addCase(updateFood.fulfilled, state => {
                state.isLoadList = false
            })
            .addCase(createFood.fulfilled, state => {
                state.isLoadList = false
            })
            .addCase(deleteFood.fulfilled, state => {
                state.isLoadList = false
            })
    },
})

// Action creators are generated for each case reducer function

export const selectFoods = (state: RootState) => state.food.list
export const selectFood = (state: RootState) => state.food.item
export const selectFoodPaginations = (state: RootState) => state.food.pagination;
export const selectIsLoadFoodList = (state: RootState) => state.food.isLoadList

export const foodReducer = food.reducer
