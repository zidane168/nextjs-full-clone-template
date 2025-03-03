import districtApi from "@/services/api/district/district.api";
import { IDistrict, IDistrictCreateRequest, IDistrictState, IDistrictUpdateRequest } from "@/types/district";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { reducerActions } from "./action";
import { IDeleteRequest, IDetailRequest, IFieldLanguage, ISelectOption } from "@/types/common";

export const initialState: IDistrictState = {
  list: [] as IDistrict[],
  isLoadList: false,
  item: {} as IDistrict,
}

export const getDistricts = createAsyncThunk('district/getDistrictsThunk', async () => {
  const { data: response } = await districtApi.fetchList();
  return response;
})

export const getDistrictDetail = createAsyncThunk('district/fetchDistrictDetailThunk', async (payload: IDetailRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await districtApi.fetchDistrictDetail(newPayload);
  return response;
})

export const updateDistrict = createAsyncThunk('district/updateDistrictThunk', async (payload: IDistrictUpdateRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await districtApi.updateDistrict(newPayload);
  return response;
})

export const createDistrict = createAsyncThunk('district/createDistrictThunk', async (payload: IDistrictCreateRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await districtApi.createDistrict(newPayload);
  return response;
})

export const deleteDistrict = createAsyncThunk('district/deleteDistrictThunk', async (payload: IDeleteRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await districtApi.deleteDistrict(newPayload);
  return response;
})


const district = createSlice({
  name: "district",
  initialState,
  reducers: reducerActions,
  extraReducers(builder) {
    builder
      .addCase(getDistricts.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.isLoadList = true;
      })
      .addCase(getDistrictDetail.fulfilled, (state, action) => {
        state.item = action.payload.data; 
      })
      .addCase(updateDistrict.fulfilled, (state) => {
        state.isLoadList = false;
      })
      .addCase(createDistrict.fulfilled, (state) => {
        state.isLoadList = false;
      })
      .addCase(deleteDistrict.fulfilled, (state) => {
        state.isLoadList = false;
      })
  },
});

// Action creators are generated for each case reducer function

export const selectDistricts = (state: RootState) => state.district.list;
export const selectIsLoadDistrictList = (state: RootState) => state.district.isLoadList;
export const selectDistrictDetail = (state: RootState) => state.district.item;

export const selectDistrictOptions = (locale: string) => createSelector(
  [state => state.district.list],
  (districts) => districts.map((item: IDistrict) => {
    return {
      label: item.name?.[locale as keyof IFieldLanguage] ?? '',
      value: item.id
    } as ISelectOption
  })
)

export const districtReducer = district.reducer;

