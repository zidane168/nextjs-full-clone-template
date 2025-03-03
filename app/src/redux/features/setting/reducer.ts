import settingApi from "@/services/api/setting/setting.api";
import { ISetting, ISettingState, ISettingUpdateRequest } from "@/types/setting";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { reducerActions } from "./action";
import { IDetailRequest } from "@/types/common";

export const initialState: ISettingState = {
  list: [] as ISetting[],
  isLoadList: false,
  item: {} as ISetting,
}

export const getSettings = createAsyncThunk('setting/getSettingsThunk', async () => {
  const { data: response } = await settingApi.fetchList();
  return response;
})

export const getSettingDetail = createAsyncThunk('setting/fetchSettingDetailThunk', async (payload: IDetailRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await settingApi.fetchSettingDetail(newPayload);
  return response;
})

export const updateSetting = createAsyncThunk('setting/updateSettingThunk', async (payload: ISettingUpdateRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await settingApi.updateSetting(newPayload);
  return response;
})

const setting = createSlice({
  name: "setting",
  initialState,
  reducers: reducerActions,
  extraReducers(builder) {
    builder
      .addCase(getSettings.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.isLoadList = true;
      })
      .addCase(getSettingDetail.fulfilled, (state, action) => {
        state.item = action.payload.data; 
      })
      .addCase(updateSetting.fulfilled, (state) => {
        state.isLoadList = false;
      })
  },
});

// Action creators are generated for each case reducer function

export const selectSettings = (state: RootState) => state.setting.list;
export const selectIsLoadSettingList = (state: RootState) => state.setting.isLoadList;
export const selectSettingDetail = (state: RootState) => state.setting.item;

export const settingReducer = setting.reducer;

