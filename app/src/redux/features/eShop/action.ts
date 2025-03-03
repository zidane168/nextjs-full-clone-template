import { IEShopReducerState } from "@/types/eShop"
import { SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit"

export const reducerActions: ValidateSliceCaseReducers<
    IEShopReducerState,
    SliceCaseReducers<IEShopReducerState>
> = {}
