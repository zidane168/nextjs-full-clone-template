import { IRegionState } from "@/types/district"
import { SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit"

export const reducerActions: ValidateSliceCaseReducers<
    IRegionState,
    SliceCaseReducers<IRegionState>
> = {}
