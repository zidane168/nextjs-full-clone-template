import memberApi from "@/services/api/member/member.api";
import { IChangeStatusRequest } from "@/types/common";
import { IMember, IMemberRequest, IMemberResetPassword, IMemberState, IMemberUpdate } from "@/types/member";
import { PAGINATION_DEFAULT } from "@/utils/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { reducerActions } from "./action";

export const initialState: IMemberState = {
  list: [],
  isLoadList: false,
  pagination: PAGINATION_DEFAULT,
  item: {} as IMember,
}

export const getMembers = createAsyncThunk('member/getMembersThunk', async (data: Record<string,string>) => {
  const { data: response } = await memberApi.fetchList(data);
  return response;
})

export const getMember = createAsyncThunk('member/getMemberThunk', async (id: string) => {
  const { data: response } = await memberApi.getDetail(id);
  return response;
})

export const updateMember = createAsyncThunk('member/updateMemberThunk', async (payload: IMemberUpdate) => {
  const { data: response } = await memberApi.update(payload);
  return response;
})

export const createMember = createAsyncThunk(
  "member/createMemberThunk",
  async (payload: IMemberRequest) => {
      const { data: response } = await memberApi.create(payload)
      return response
  },
)

export const resetPassword = createAsyncThunk('member/resetPassword', async (payload: IMemberResetPassword) => {
  const newPayload = { ...payload };
  const { data: response } = await memberApi.resetPassword(newPayload);
  return response;
})

export const changeStatusMember = createAsyncThunk('member/changeStatusMemberThunk', async (payload: IChangeStatusRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await memberApi.changeStatus(newPayload);
  return response;
})

export const exportMember = createAsyncThunk('member/exportMemberThunk', async (data?: Record<string,string>) => {
  const { data: response } = await memberApi.export(data);
  return response;
})

const member = createSlice({
  name: "member",
  initialState,
  reducers: reducerActions,
  extraReducers(builder) {
    builder
      .addCase(getMembers.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.isLoadList = true;
        state.pagination = action.payload?._metadata?.pagination ?? {};
      })
      .addCase(getMember.fulfilled, (state, action) => {
        state.item = action.payload.data;
      })
      .addCase(updateMember.fulfilled, (state) => {
        state.isLoadList = false;
      })
      .addCase(createMember.fulfilled, (state) => {
        state.isLoadList = false;
      })
      .addCase(changeStatusMember.fulfilled, state => {
        state.isLoadList = false
    })
  },
});

// Action creators are generated for each case reducer function

export const selectMembers = (state: RootState) => state.member.list;
export const selectMember = (state: RootState) => state.member.item;
export const selectMemberPaginations = (state: RootState) => state.member.pagination;
export const selectIsLoadList = (state: RootState) => state.member.isLoadList;

export const memberReducer = member.reducer;

