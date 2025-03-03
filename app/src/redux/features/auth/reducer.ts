import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { reducerActions } from "./action";
import { ILoginRequest } from "@/types/common";
import { IAuthState, ILoginUser } from "@/types/user";
import { jwtService } from "@/services";
import authApi from "@/services/api/auth/auth.api";

export const initialState: IAuthState = {
  user: null,
  masterData: {},
  isLoadMasterdata: false,
};

export const signIn = createAsyncThunk('auth/signIn', async (params: ILoginRequest) => {
  const { data } = await authApi.signIn(params);
  return data;
})

export const getUserProfile = createAsyncThunk('auth/getUserProfile', async () => {
  const { data } = await authApi.fetchUser();
  return data;
})

export const getMasterData = createAsyncThunk('admin/getMasterData', async () => {
  const { data } = await authApi.fetchMasterData();
  return data;
})

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: reducerActions,
  extraReducers(builder) {
    builder
      .addCase(signIn.fulfilled, (state, { payload }) => {
        jwtService.saveToken(payload?.data?.accessToken ?? '')
        jwtService.saveRefreshToken(payload?.data?.refreshToken ?? '')
      }),
    builder
      .addCase(getUserProfile.fulfilled, (state, {payload}) => {
        state.user = payload.data as ILoginUser;
      }),
    builder
      .addCase(getMasterData.fulfilled, (state, {payload}) => {
        state.masterData = payload.data;
        state.isLoadMasterdata = true;
      })
  },
});

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthUserPermissions = (state: RootState) => state.auth.user?.permissions;
export const selectMasterData = (state: RootState) => state.auth.masterData;
export const selectIsLoadMasterData = (state: RootState) => state.auth.isLoadMasterdata;

// Action creators are generated for each case reducer function
export const { signOut } = auth.actions;
export const authReducer = auth.reducer;

