import { IFoodReducerState } from "@/types/food"

import { SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit"

export const reducerActions: ValidateSliceCaseReducers<
    IFoodReducerState,
    SliceCaseReducers<IFoodReducerState>
> = {}
