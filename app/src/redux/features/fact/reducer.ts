import factApi from "@/services/api/fact/fact.api";
import { IFactUpdate, IFact, IFactRequest, IFactState } from "@/types/fact";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { reducerActions } from "./action";
import { IChangeStatusRequest, IDeleteRequest } from "@/types/common";

export const initialState: IFactState = {
  list: [] as IFact[],
  isLoadList: false,
  item: {} as IFact,
}

export const getFacts = createAsyncThunk('fact/getFactsThunk', async () => {
  const { data: response } = await factApi.fetchList();
  return response;
})

export const getFact = createAsyncThunk('fact/getFactThunk', async (id: string) => {
  const { data: response } = await factApi.getDetail(id);
  return response;
})

export const updateFact = createAsyncThunk('fact/updateFactThunk', async (payload: IFactUpdate) => {
  const { data: response } = await factApi.update(payload);
  return response;
})

export const createFact = createAsyncThunk('fact/createFactThunk', async (payload: IFactRequest) => {
  const { data: response } = await factApi.create(payload);
  return response;
})

export const deleteFact = createAsyncThunk('fact/deleteFactThunk', async (payload: IDeleteRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await factApi.delete(newPayload);
  return response;
})

export const changeStatusFact = createAsyncThunk('fact/changeStatusFactThunk', async (payload: IChangeStatusRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await factApi.changeStatus(newPayload);
  return response;
})

const fact = createSlice({
  name: "fact",
  initialState,
  reducers: reducerActions,
  extraReducers(builder) {
    builder
      .addCase(getFacts.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.isLoadList = true;
      })
      .addCase(getFact.fulfilled, (state, action) => {
        state.item = action.payload.data
      })
      .addCase(updateFact.fulfilled, (state) => {
        state.isLoadList = false;
      })
      .addCase(deleteFact.fulfilled, (state) => {
        state.isLoadList = false;
      })
      .addCase(changeStatusFact.fulfilled, (state) => {
        state.isLoadList = false;
      })
  },
});

// Action creators are generated for each case reducer function

export const selectFacts = (state: RootState) => state.fact.list;
export const selectFact = (state: RootState) => state.fact.item;
export const selectIsFactLoadList = (state: RootState) => state.fact.isLoadList;

export const factReducer = fact.reducer;

