import { IContactInfoReducerState } from "@/types/contactInfo"
import { SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit"

export const reducerActions: ValidateSliceCaseReducers<
    IContactInfoReducerState,
    SliceCaseReducers<IContactInfoReducerState>
> = {}
