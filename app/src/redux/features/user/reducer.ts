import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { reducerActions } from "./action";
import { IUserState, IUser, IUserCreateRequest, IUserUpdateRequest } from "@/types/user";
import userApi from "@/services/api/administrator/user.api";
import { IChangeStatusRequest, IDetailRequest } from "@/types/common";

export const initialState: IUserState = {
  list: [],
  isLoadList: false,
  item: {} as IUser,
}

export const getUsers = createAsyncThunk('admin/fetchAdminsThunk', async () => {
  const { data: response } = await userApi.fetchList();
  return response;
})

export const getUserDetail = createAsyncThunk('admin/fetchAdminDetailThunk', async (payload: IDetailRequest) => {
  const { data: response } = await userApi.fetchUserDetail(payload);
  return response;
})

export const createUser = createAsyncThunk('admin/createAdminThunk', async (payload: IUserCreateRequest) => {
  const { data: response } = await userApi.createUser(payload);
  return response;
});

export const updateUser = createAsyncThunk('admin/updateAdminThunk', async (payload: IUserUpdateRequest) => {
  const { data: response } = await userApi.updateUser(payload);
  return response;
});

export const changeStatusUser = createAsyncThunk('user/changeStatusUserThunk', async (payload: IChangeStatusRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await userApi.changeStatusUser(newPayload);
  return response;
})


const user = createSlice({
  name: "user",
  initialState,
  reducers: reducerActions,
  extraReducers(builder) {
    builder
      .addCase(getUsers.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.isLoadList = true;
      })

      //Fetch user detail
      .addCase(getUserDetail.fulfilled, (state, action) => {
        state.item = action.payload.data; 
      })

      //Update user
      .addCase(updateUser.fulfilled, (state) => {
        state.isLoadList = false;
      })

      //Create user
      .addCase(createUser.fulfilled, (state) => {
        state.isLoadList = false;
      })

      //Change status User
      .addCase(changeStatusUser.fulfilled, (state) => {
        state.isLoadList = false;
      })
  },
});

// Action creators are generated for each case reducer function
export const selectUsers = (state: RootState) => state.user.list;
export const selectIsLoadList = (state: RootState) => state.user.isLoadList;
export const selectUserDetail = (state: RootState) => state.user.item;

export const selectUserDetailFormat = createSelector(selectUserDetail, 
  userDetail => {
    let roleId = null;
    if (userDetail.roles && userDetail.roles.length > 0) {
      roleId = userDetail.roles[0].role.id;
    }

    return {...userDetail, roleId: roleId}
  })


export const userReducer = user.reducer;

