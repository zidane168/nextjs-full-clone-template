import regionApi from "@/services/api/region/district.api"
import { IDetailRequest } from "@/types/common"
import {
    IRegion,
    IRegionState
} from "@/types/district"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { reducerActions } from "./action"

export const initialState: IRegionState = {
    list: [] as IRegion[],
    isLoadList: false,
    item: {} as IRegion,
}

export const getRegions = createAsyncThunk("region/getRegionsThunk", async () => {
    const { data: response } = await regionApi.fetchList()
    return response
})

export const getRegionDetail = createAsyncThunk(
    "region/fetchRegionDetailThunk",
    async (payload: IDetailRequest) => {
        const newPayload = { ...payload }
        const { data: response } = await regionApi.fetchRegionDetail(newPayload)
        return response
    },
)

const region = createSlice({
    name: "region",
    initialState,
    reducers: reducerActions,
    extraReducers(builder) {
        builder
            .addCase(getRegions.fulfilled, (state, action) => {
                state.list = action.payload.data
                state.isLoadList = true
            })
            .addCase(getRegionDetail.fulfilled, (state, action) => {
                state.item = action.payload.data
            })
    },
})

// Action creators are generated for each case reducer function

export const selectRegions = (state: RootState) => state.region.list
export const selectIsLoadRegionList = (state: RootState) => state.region.isLoadList
export const selectRegionDetail = (state: RootState) => state.region.item

// export const selectDistrictOptions = (locale: string) =>
//     createSelector([state => state.district.list], districts =>
//         districts.map((item: IDistrict) => {
//             return {
//                 label: item.name?.[locale as keyof IFieldLanguage] ?? "",
//                 value: item.id,
//             } as ISelectOption
//         }),
//     )

export const regionReducer = region.reducer
