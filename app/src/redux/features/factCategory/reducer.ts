 import factCategoryApi from "@/services/api/factCategory/factCategory.api";
import { IChangeStatusRequest, IDeleteRequest, IDetailRequest, IFieldLanguage, ISelectOption } from "@/types/common";
import { IFactCategory, IFactCategoryCreateRequest, IFactCategoryUpdateRequest, IFactCategoryState } from "@/types/factCategory";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { reducerActions } from "./action";

export const initialState: IFactCategoryState = {
    list: [] as IFactCategory[],
    isLoadList: false,
    item: {} as IFactCategory,
}

export const getFactCategories = createAsyncThunk('factCategory/fetchFactCategoriesThunk', async () => {
  const { data: response } = await factCategoryApi.fetchFactCategories();
  return response;
})

export const getFactCategoryDetail = createAsyncThunk('factCategory/fetchFactCategoryDetailThunk', async (payload: IDetailRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await factCategoryApi.fetchFactCategoryDetail(newPayload);
  return response;
})

export const updateFactCategory = createAsyncThunk('factCategory/updateFactCategoryThunk', async (payload: IFactCategoryUpdateRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await factCategoryApi.updateFactCategory(newPayload);
  return response;
})

export const createFactCategory = createAsyncThunk('factCategory/createFactCategoryThunk', async (payload: IFactCategoryCreateRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await factCategoryApi.createFactCategory(newPayload);
  return response;
})

export const deleteFactCategory = createAsyncThunk('factCategory/deleteFactCategoryThunk', async (payload: IDeleteRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await factCategoryApi.deleteFactCategory(newPayload);
  return response;
})

export const changeStatusFactCategory = createAsyncThunk('factCategory/changeStatusFactCategoryThunk', async (payload: IChangeStatusRequest) => {
  const newPayload = { ...payload };
  const { data: response } = await factCategoryApi.changeStatusFactCategory(newPayload);
  return response;
})


const factCategory = createSlice({
  name: "factCategory",
  initialState,
  reducers: reducerActions,
  extraReducers(builder) {
    builder
      //Fetch FactCategory list
      .addCase(getFactCategories.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.isLoadList = true;
      })

      //Fetch FactCategory detail
      .addCase(getFactCategoryDetail.fulfilled, (state, action) => {
        state.item = action.payload.data; 
      })

      //Update FactCategory
      .addCase(updateFactCategory.fulfilled, (state) => {
        state.isLoadList = false;
      })

      //Create FactCategory
      .addCase(createFactCategory.fulfilled, (state) => {
        state.isLoadList = false;
      })

      //Delete FactCategory
      .addCase(deleteFactCategory.fulfilled, (state) => {
        state.isLoadList = false;
      })

      //Change status FactCategory
      .addCase(changeStatusFactCategory.fulfilled, (state) => {
        state.isLoadList = false;
      })
    },
});

// Action creators are generated for each case reducer function
export const selectFactCategories = (state: RootState) => state.factCategory.list;
export const selectIsLoadList = (state: RootState) => state.factCategory.isLoadList;
export const selectFactCategoryDetail = (state: RootState) => state.factCategory.item;

export const selectFactCategoryOptions = (locale: string) =>
    createSelector([state => state.factCategory.list], factCategoryList =>
        factCategoryList.map((factCategory: IFactCategory) => {
            return {
                label: factCategory.name?.[locale as keyof IFieldLanguage] ?? "",
                value: factCategory.id,
            } as ISelectOption
        }),
    )

export const factCategoryReducer = factCategory.reducer;

