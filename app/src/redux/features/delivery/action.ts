import { IDeliveryState } from "@/types/delivery"
import { IDistrictState, IRegionState } from "@/types/district"
import { SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit"

export const reducerActions: ValidateSliceCaseReducers<
    IDeliveryState,
    SliceCaseReducers<IDeliveryState>
> = {}
