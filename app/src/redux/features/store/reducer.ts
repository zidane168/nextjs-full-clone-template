import storeApi from "@/services/api/store/store.api"
import {
    IStore,
    IStoreCreateRequest,
    IStoreDeleteRequest,
    IStoreDetailRequest,
    IStoreReducerState,
    IStoreUpdateRequest,
} from "@/types/store"
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { reducerActions } from "./action"
import { IFieldLanguage, ISelectOption } from "@/types/common"

export const initialState: IStoreReducerState = {
    list: [] as IStore[],
    isLoadList: false,
    item: {} as IStore,
}

export const getStores = createAsyncThunk("store/getCompanies", async () => {
    const { data: response } = await storeApi.fetchList()
    return response
})

export const getStoreDetail = createAsyncThunk(
    "store/getStoreDetail",
    async (payload: IStoreDetailRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await storeApi.fetchStoreDetail(newPayload)
        return response
    },
)

export const updateStore = createAsyncThunk(
    "store/updateStore",
    async (payload: IStoreUpdateRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await storeApi.updateStore(newPayload)
        return response
    },
)

export const createStore = createAsyncThunk(
    "store/createStore",
    async (payload: IStoreCreateRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await storeApi.createStore(newPayload)
        return response
    },
)

export const deleteStore = createAsyncThunk(
    "store/deleteStore",
    async (payload: IStoreDeleteRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await storeApi.deleteStore(newPayload)
        return response
    },
)

const store = createSlice({
    name: "store",
    initialState,
    reducers: reducerActions,
    extraReducers(builder) {
        builder
            .addCase(getStores.fulfilled, (state, action) => {
                state.list = action.payload.data
                state.isLoadList = true
            })
            .addCase(getStoreDetail.fulfilled, (state, action) => {
                state.item = action.payload.data
            })
            .addCase(updateStore.fulfilled, state => {
                state.isLoadList = false
            })
            .addCase(createStore.fulfilled, state => {
                state.isLoadList = false
            })
            .addCase(deleteStore.fulfilled, state => {
                state.isLoadList = false
            })
    },
})

// Action creators are generated for each case reducer function

export const selectStores = (state: RootState) => state.store.list
export const selectIsLoadStoreList = (state: RootState) => state.store.isLoadList
export const selectStoreDetail = (state: RootState) => state.store.item
export const selectStoreOptions = (locale: string) => createSelector(
    [selectStores],
    (stores) => {
      return stores.filter((store: IStore) => store.enabled).map((store: IStore) => ({
        value: store.id,
        label: store.name?.[locale as keyof IFieldLanguage] ?? ""
      } as ISelectOption))
    }
  )

export const storeReducer = store.reducer
