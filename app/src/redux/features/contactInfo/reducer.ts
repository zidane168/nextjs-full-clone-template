import contact_info_api from "@/services/api/contactInfo/contactInfo.api"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import {
    IContactInfo,
    IContactInfoCreateRequest,
    IContactInfoDeleteRequest,
    IContactInfoReducerState,
    IContactInfoUpdateRequest,
} from "./../../../types/contactInfo"
import { reducerActions } from "./action"

export const initialState: IContactInfoReducerState = {
    list: [] as IContactInfo[],
    isLoadList: false,
    item: {} as IContactInfo,
}

export const getContactInfos = createAsyncThunk("contactInfo/getContactInfos", async () => {
    const { data: response } = await contact_info_api.fetchList()
    return response
})

export const getContactInfo = createAsyncThunk(
    "contactInfo/getContactInfo",
    async (id: string | number) => {
        const { data: response } = await contact_info_api.getDetail(id)
        return response
    },
)

export const updateContactInfo = createAsyncThunk(
    "contactInfo/updateContactInfo",
    async (payload: IContactInfoUpdateRequest) => {
        const { data: response } = await contact_info_api.update(payload)
        return response
    },
)

export const createContactInfo = createAsyncThunk(
    "contactInfo/createFactThunk",
    async (payload: IContactInfoCreateRequest) => {
        const { data: response } = await contact_info_api.create(payload)
        return response
    },
)

export const deleteContactInfo = createAsyncThunk(
    "contactInfo/deleteFactThunk",
    async (payload: IContactInfoDeleteRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await contact_info_api.delete(newPayload)
        return response
    },
)

const contactInfo = createSlice({
    name: "contactInfo",
    initialState,
    reducers: reducerActions,
    extraReducers(builder) {
        builder
            .addCase(getContactInfos.fulfilled, (state, action) => {
                state.list = action.payload.data
                state.isLoadList = true
            })
            .addCase(getContactInfo.fulfilled, (state, action) => {
                state.item = action.payload.data
            })
            .addCase(updateContactInfo.fulfilled, state => {
                state.isLoadList = false
            })
            .addCase(deleteContactInfo.fulfilled, state => {
                state.isLoadList = false
            })
    },
})

// Action creators are generated for each case reducer function

export const selectContactInfos = (state: RootState) => state.contactInfo.list
export const selectContactInfo = (state: RootState) => state.contactInfo.item
export const selectIsContactInfoLoadList = (state: RootState) => state.contactInfo.isLoadList

export const contactInfoReducer = contactInfo.reducer
