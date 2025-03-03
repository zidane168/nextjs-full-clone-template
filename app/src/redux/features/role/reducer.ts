import roleApi from "@/services/api/role/role.api";
import { IChangeStatusRequest, IDeleteRequest, IDetailRequest, ISelectOption } from "@/types/common";
import { IRole, IRoleCreateRequest, IRoleState, IRoleUpdateRequest } from "@/types/role";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { reducerActions } from "./action";

export const initialState: IRoleState = {
    list: [] as IRole[],
    isLoadList: false,
    item: {} as IRole,
}

export const getRoles = createAsyncThunk('role/fetchRolesThunk', async () => {
  const { data: response } = await roleApi.fetchRoles();
  return response;
})

export const getRoleDetail = createAsyncThunk('role/fetchRoleDetailThunk', async (payload: IDetailRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await roleApi.fetchRoleDetail(newPayload);
  return response;
})

export const updateRole = createAsyncThunk('role/updateRoleThunk', async (payload: IRoleUpdateRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await roleApi.updateRole(newPayload);
  return response;
})

export const createRole = createAsyncThunk('role/createRoleThunk', async (payload: IRoleCreateRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await roleApi.createRole(newPayload);
  return response;
})

export const deleteRole = createAsyncThunk('role/deleteRoleThunk', async (payload: IDeleteRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await roleApi.deleteRole(newPayload);
  return response;
})

export const changeStatusRole = createAsyncThunk('role/changeStatusRoleThunk', async (payload: IChangeStatusRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await roleApi.changeStatusRole(newPayload);
  return response;
})

const role = createSlice({
  name: "role",
  initialState,
  reducers: reducerActions,
  extraReducers(builder) {
    builder
      //Fetch role list
      .addCase(getRoles.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.isLoadList = true;
      })

      //Fetch role detail
      .addCase(getRoleDetail.fulfilled, (state, action) => {
        state.item = action.payload.data; 
      })

      //Update role
      .addCase(updateRole.fulfilled, (state) => {
        state.isLoadList = false;
      })

      //Create role
      .addCase(createRole.fulfilled, (state) => {
        state.isLoadList = false;
      })

      //Delete role
      .addCase(deleteRole.fulfilled, (state) => {
        state.isLoadList = false;
      })

      //Change status role
      .addCase(changeStatusRole.fulfilled, (state) => {
        state.isLoadList = false;
      })
    },
});

// Action creators are generated for each case reducer function
export const selectRoles = (state: RootState) => state.role.list;
export const selectIsLoadList = (state: RootState) => state.role.isLoadList;
export const selectRoleDetail = (state: RootState) => state.role.item;

export const selectRoleOptions = createSelector(selectRoles, roleList => {
  const options: ISelectOption[] = [];

  roleList.forEach((item:IRole) => {
    options.push({label: item.title, value: item.id})
  })

  return options;
})


export const roleReducer = role.reducer;

