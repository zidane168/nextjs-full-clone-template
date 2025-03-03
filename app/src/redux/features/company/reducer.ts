import companyApi from "@/services/api/company/company.api"
import {
    ICompany,
    ICompanyCreate,
    ICompanyDelete,
    ICompanyDetailRequest,
    ICompanyReducerState,
    ICompanyUpdate,
} from "@/types/company"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { reducerActions } from "./action"

export const initialState: ICompanyReducerState = {
    list: [] as ICompany[],
    isLoadList: false,
    item: {} as ICompany,
}

export const getCompanies = createAsyncThunk("company/getCompanies", async () => {
    const { data: response } = await companyApi.fetchList()
    return response
})

export const getCompanyDetail = createAsyncThunk(
    "company/getCompanyDetail",
    async (payload: ICompanyDetailRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await companyApi.fetchCompanyDetail(newPayload)
        return response
    },
)

export const updateCompany = createAsyncThunk(
    "company/updateCompany",
    async (payload: ICompanyUpdate) => {
        const newPayload = { ...payload }
        const { data: response } = await companyApi.updateCompany(newPayload)
        return response
    },
)

export const createCompany = createAsyncThunk(
    "company/createCompany",
    async (payload: ICompanyCreate) => {
        const newPayload = { ...payload }
        const { data: response } = await companyApi.createCompany(newPayload)
        return response
    },
)

export const deleteCompany = createAsyncThunk(
    "company/deleteCompany",
    async (payload: ICompanyDelete) => {
        const newPayload = { ...payload }
        const { data: response } = await companyApi.deleteCompany(newPayload)
        return response
    },
)

const company = createSlice({
    name: "company",
    initialState,
    reducers: reducerActions,
    extraReducers(builder) {
        builder
            .addCase(getCompanies.fulfilled, (state, action) => {
                state.list = action.payload.data
                state.isLoadList = true
            })
            .addCase(getCompanyDetail.fulfilled, (state, action) => {
                state.item = action.payload.data
            })
            .addCase(updateCompany.fulfilled, state => {
                state.isLoadList = false
            })
            .addCase(createCompany.fulfilled, state => {
                state.isLoadList = false
            })
            .addCase(deleteCompany.fulfilled, state => {
                state.isLoadList = false
            })
    },
})

// Action creators are generated for each case reducer function

export const selectCompanies = (state: RootState) => state.company.list
export const selectIsLoadCompanyList = (state: RootState) => state.company.isLoadList
export const selectCompanyDetail = (state: RootState) => state.company.item

export const companyReducer = company.reducer
