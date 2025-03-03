import countryApi from "@/services/api/country/country.api";
import { IFieldLanguage, ISelectOption } from "@/types/common";
import { ICountry, ICountryState } from "@/types/country";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { reducerActions } from "./action";

export const initialState: ICountryState = {
  list: [] as ICountry[],
  isLoadList: false,
  item: {} as ICountry,
}

export const getCountries = createAsyncThunk('district/getCountriesThunk', async () => {
  const { data: response } = await countryApi.fetchList();
  return response;
})

const country = createSlice({
  name: "country",
  initialState,
  reducers: reducerActions,
  extraReducers(builder) {
    builder
      .addCase(getCountries.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.isLoadList = true;
      })
  },
});

// Action creators are generated for each case reducer function

export const selectCountry = (state: RootState) => state.country.item;
export const selectIsLoadList = (state: RootState) => state.country.isLoadList;

export const selectCountryOptions = (locale: string) => createSelector(
  [state => state.country.list],
  (countryList) => countryList.map((item: ICountry) => {
    return {
      label: item.name?.[locale as keyof IFieldLanguage] ?? '',
      value: item.id
    } as ISelectOption
  })
)

export const countryReducer = country.reducer;

