import { INewReducerState } from "@/types/news"
import { SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit"

export const reducerActions: ValidateSliceCaseReducers<
    INewReducerState,
    SliceCaseReducers<INewReducerState>
> = {}
