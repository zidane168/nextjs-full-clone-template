import newsApi from "@/services/api/news/news.api"
import {
    INew,
    INewCreateRequest,
    INewDeleteRequest,
    INewReducerState,
    INewUpdateRequest,
} from "@/types/news"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { reducerActions } from "./action"

export const initialState: INewReducerState = {
    list: [] as INew[],
    isLoadList: false,
    item: {} as INew,
}

export const getNews = createAsyncThunk("news/getNews", async () => {
    const { data: response } = await newsApi.fetchList()
    return response
})

export const getNewsDetail = createAsyncThunk(
    "news/getNewsDetail",
    async (payload: INewDeleteRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await newsApi.fetchNewsDetail(newPayload)
        return response
    },
)

export const updateNews = createAsyncThunk(
    "news/updateNews",
    async (payload: INewUpdateRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await newsApi.updateNews(newPayload)
        return response
    },
)

export const createNews = createAsyncThunk(
    "news/createNews",
    async (payload: INewCreateRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await newsApi.createNews(newPayload)
        return response
    },
)

export const deleteNews = createAsyncThunk(
    "news/deleteNews",
    async (payload: INewDeleteRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await newsApi.deleteNews(newPayload)
        return response
    },
)

const news = createSlice({
    name: "news",
    initialState,
    reducers: reducerActions,
    extraReducers(builder) {
        builder
            .addCase(getNews.fulfilled, (state, action) => {
                state.list = action.payload.data
                state.isLoadList = true
            })
            .addCase(getNewsDetail.fulfilled, (state, action) => {
                state.item = action.payload.data
            })
            .addCase(updateNews.fulfilled, state => {
                state.isLoadList = false
            })
            .addCase(createNews.fulfilled, state => {
                state.isLoadList = false
            })
            .addCase(deleteNews.fulfilled, state => {
                state.isLoadList = false
            })
    },
})

// Action creators are generated for each case reducer function

export const selectNews = (state: RootState) => state.news.list
export const selectIsLoadNewsList = (state: RootState) => state.news.isLoadList
export const selectNewsDetail = (state: RootState) => state.news.item

export const newsReducer = news.reducer
