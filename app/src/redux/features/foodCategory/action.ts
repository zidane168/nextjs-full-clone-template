import { IFoodCategoryReducerState } from "@/types/food-category"
import { SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit"

export const reducerActions: ValidateSliceCaseReducers<
    IFoodCategoryReducerState,
    SliceCaseReducers<IFoodCategoryReducerState>
> = {}
