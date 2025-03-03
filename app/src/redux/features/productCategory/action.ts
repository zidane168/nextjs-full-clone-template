import { IProductCategoryState } from "@/types/productCategory"
import { SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit"

export const reducerActions: ValidateSliceCaseReducers<
    IProductCategoryState,
    SliceCaseReducers<IProductCategoryState>
> = {}
