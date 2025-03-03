import permissionApi from "@/services/api/permission/permission.api";
import { IPermission, IPermissionState, ISelectorPermission } from "@/types/permission";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { reducerActions } from "./action";

export const initialState: IPermissionState = {
    list: [] as IPermission[],
    isLoadList: false,
}

export const getPermissions = createAsyncThunk('permission/fetchPermissionsThunk', async () => {
  const { data: response } = await permissionApi.fetchPermissions();
  return response;
})

const permission = createSlice({
  name: "permission",
  initialState,
  reducers: reducerActions,
  extraReducers(builder) {
    builder
      //Fetch permission list
      .addCase(getPermissions.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.isLoadList = true;
      })
    },
});

// Action creators are generated for each case reducer function
export const selectPermissions = (state: RootState) => state.permission.list;
export const selectIsLoadList = (state: RootState) => state.permission.isLoadList;

export const selectPermissionsFormat = createSelector(selectPermissions, 
  permissionList => {
    const temp: ISelectorPermission = {};

    permissionList?.forEach((item:IPermission) => {
      const subject = item.subject;

      if(!temp[subject]){
        temp[subject] = []
      }

      temp[subject].push({
        action: item.action,
        id: item.id
      })

    })

    return temp
  })

export const { setSelectedPermissions } = permission.actions;
export const permissionReducer = permission.reducer;

