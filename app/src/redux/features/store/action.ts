import { IStoreReducerState } from "@/types/store"
import { SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit"

export const reducerActions: ValidateSliceCaseReducers<
    IStoreReducerState,
    SliceCaseReducers<IStoreReducerState>
> = {}
