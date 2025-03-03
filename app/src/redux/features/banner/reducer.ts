import bannerApi from "@/services/api/banner/banner.api";
import { IChangeStatusRequest, IDeleteRequest, IDetailRequest } from "@/types/common";
import { IBanner, IBannerCreateRequest, IBannerUpdateRequest, IBannerState } from "@/types/banner";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { reducerActions } from "./action";

export const initialState: IBannerState = {
    list: [] as IBanner[],
    isLoadList: false,
    item: {} as IBanner,
}

export const getBanners = createAsyncThunk('banner/fetchBannersThunk', async () => {
  const { data: response } = await bannerApi.fetchBanners();
  return response;
})

export const getBannerDetail = createAsyncThunk('banner/fetchBannerDetailThunk', async (payload: IDetailRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await bannerApi.fetchBannerDetail(newPayload);
  return response;
})

export const updateBanner = createAsyncThunk('banner/updateBannerThunk', async (payload: IBannerUpdateRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await bannerApi.updateBanner(newPayload);
  return response;
})

export const createBanner = createAsyncThunk('banner/createBannerThunk', async (payload: IBannerCreateRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await bannerApi.createBanner(newPayload);
  return response;
})

export const deleteBanner = createAsyncThunk('banner/deleteBannerThunk', async (payload: IDeleteRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await bannerApi.deleteBanner(newPayload);
  return response;
})

export const changeStatusBanner = createAsyncThunk('banner/changeStatusBannerThunk', async (payload: IChangeStatusRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await bannerApi.changeStatusBanner(newPayload);
  return response;
})


const banner = createSlice({
  name: "banner",
  initialState,
  reducers: reducerActions,
  extraReducers(builder) {
    builder
      //Fetch Banner list
      .addCase(getBanners.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.isLoadList = true;
      })

      //Fetch Banner detail
      .addCase(getBannerDetail.fulfilled, (state, action) => {
        state.item = action.payload.data; 
      })

      //Update Banner
      .addCase(updateBanner.fulfilled, (state) => {
        state.isLoadList = false;
      })

      //Create Banner
      .addCase(createBanner.fulfilled, (state) => {
        state.isLoadList = false;
      })

      //Delete Banner
      .addCase(deleteBanner.fulfilled, (state) => {
        state.isLoadList = false;
      })

      //Change status Banner
      .addCase(changeStatusBanner.fulfilled, (state) => {
        state.isLoadList = false;
      })
    },
});

// Action creators are generated for each case reducer function
export const selectBanners = (state: RootState) => state.banner.list;
export const selectIsLoadList = (state: RootState) => state.banner.isLoadList;
export const selectBannerDetail = (state: RootState) => state.banner.item;

// export const { } = Banner.actions;
export const BannerReducer = banner.reducer;

