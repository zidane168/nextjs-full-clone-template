import { IDetailRequest } from "@/types/common"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { reducerActions } from "./action"

import deliveryApi from "@/services/api/delivery/delivery.api"
import {
    IDelivery,
    IDeliveryCreateRequest,
    IDeliveryState,
    IDeliveryUpdateRequest,
} from "@/types/delivery"

export const initialState: IDeliveryState = {
    list: [] as IDelivery[],
    isLoadList: false,
    item: {} as IDelivery,
}

export const getDeliveries = createAsyncThunk("delivery/getDeliveriesThunk", async () => {
    const { data: response } = await deliveryApi.fetchList()
    return response
})

export const getDeliveryDetail = createAsyncThunk(
    "delivery/fetchDeliveryDetailThunk",
    async (payload: IDetailRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await deliveryApi.fetchRegionDetail(newPayload)
        return response
    },
)
export const createDelivery = createAsyncThunk(
    "delivery/createDeliveryThunk",
    async (payload: IDeliveryCreateRequest) => {
        const { data: response } = await deliveryApi.createDelivery(payload)
        return response
    },
)
export const updateDelivery = createAsyncThunk(
    "fact/updateDeliveryThunk",
    async (payload: IDeliveryUpdateRequest) => {
        const { data: response } = await deliveryApi.updateDelivery(payload)
        return response
    },
)

// export const deleteFact = createAsyncThunk(
//     "fact/deleteFactThunk",
//     async (payload: IDeleteRequest) => {
//         const newPayload = { ...payload }
//         const { data: response } = await deliveryApi.delete(newPayload)
//         return response
//     },
// )

const delivery = createSlice({
    name: "delivery",
    initialState,
    reducers: reducerActions,
    extraReducers(builder) {
        builder
            .addCase(getDeliveries.fulfilled, (state, action) => {
                state.list = action.payload.data
                state.isLoadList = true
            })
            .addCase(getDeliveryDetail.fulfilled, (state, action) => {
                state.item = action.payload.data
            })
            .addCase(createDelivery.fulfilled, (state) => {
                state.isLoadList = false
            })
            .addCase(updateDelivery.fulfilled, (state) => {
                state.isLoadList = false
            })
    },
})

// Action creators are generated for each case reducer function

export const selectDeliveries = (state: RootState) => state.delivery.list
export const selectIsLoadDeliveryList = (state: RootState) => state.delivery.isLoadList
export const selectDeliveryDetail = (state: RootState) => state.delivery.item

export const deliveryReducer = delivery.reducer
