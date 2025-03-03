import eShopApi from "@/services/api/eShop/eShop.api"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { reducerActions } from "./action"
import { IEShop, IEShopReducerState, IEShopUpdate } from "@/types/eShop"

export const initialState: IEShopReducerState = {
    list: [] as IEShop[],
    isLoadList: false,
}

export const getEShops = createAsyncThunk("eShop/getEShops", async () => {
    const { data: response } = await eShopApi.fetchList()
    return response
})

export const updateEShop = createAsyncThunk(
    "eShop/updateEShop",
    async (payload: IEShopUpdate) => {
        const newPayload = { ...payload }
        const { data: response } = await eShopApi.updateEShop(newPayload)
        return response
    },
)

const eShop = createSlice({
    name: "eShop",
    initialState,
    reducers: reducerActions,
    extraReducers(builder) {
        builder
            .addCase(getEShops.fulfilled, (state, action) => {
                state.list = action.payload.data
                state.isLoadList = true
            })
            .addCase(updateEShop.fulfilled, state => {
                state.isLoadList = false
            })
    },
})

// Action creators are generated for each case reducer function

export const selectEShops = (state: RootState) => state.eShop.list
export const selectIsLoadEShopList = (state: RootState) => state.eShop.isLoadList

export const eShopReducer = eShop.reducer
