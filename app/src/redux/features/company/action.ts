import { ICompanyReducerState } from "@/types/company"
import { SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit"

export const reducerActions: ValidateSliceCaseReducers<
    ICompanyReducerState,
    SliceCaseReducers<ICompanyReducerState>
> = {}
