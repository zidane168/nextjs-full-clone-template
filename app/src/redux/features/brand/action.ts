import { IBrandState } from "@/types/brand"
import { SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit"

export const reducerActions: ValidateSliceCaseReducers<
    IBrandState,
    SliceCaseReducers<IBrandState>
> = {}
