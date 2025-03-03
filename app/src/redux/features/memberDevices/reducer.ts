import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { reducerActions } from "./action"
import { IDetailRequest } from "@/types/common"
import memberDeviceApi from "@/services/api/member/memberDevice.api"
import {
    IMemberDeviceState,
    IMemberDevice,
} from "@/types/memberDevice"
import { PAGINATION_DEFAULT } from "@/utils/constants"

export const initialState: IMemberDeviceState = {
    list: [] as IMemberDevice[],
    pagination: PAGINATION_DEFAULT,
    item: {} as IMemberDevice,
}

export const getMemberDevices = createAsyncThunk(
    "memberDevice/fetchMemberDevicesThunk",
    async (data: Record<string, string>) => {
        const { data: response } = await memberDeviceApi.fetchMemberDevices(data)
        return response
    },
)

export const getMemberDeviceDetail = createAsyncThunk(
    "memberDevice/fetchMemberDeviceDetailThunk",
    async (payload: IDetailRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await memberDeviceApi.fetchMemberDeviceDetail(newPayload)
        return response
    },
)

const memberDevice = createSlice({
    name: "memberDevice",
    initialState,
    reducers: reducerActions,
    extraReducers(builder) {
        builder
            //Fetch MemberDevice list
            .addCase(getMemberDevices.fulfilled, (state, action) => {
                state.list = action.payload.data
                state.pagination = action.payload?._metadata?.pagination ?? {}
            })
            .addCase(getMemberDeviceDetail.fulfilled, (state, action) => {
                state.item = action.payload.data
            })
    },
})

// Action creators are generated for each case reducer function
export const selectMemberDevices = (state: RootState) => state.memberDevice.list
export const selectMemberDevicePaginations = (state: RootState) => state.memberDevice.pagination
export const selectMemberDeviceDetail = (state: RootState) => state.memberDevice.item

// export const { } = MemberDevice.actions;
export const memberDeviceReducer = memberDevice.reducer
