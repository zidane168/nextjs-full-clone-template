import { SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit";
import { IAuthState } from "@/types/user";
import { jwtService } from "@/services";

export const reducerActions: ValidateSliceCaseReducers<IAuthState, SliceCaseReducers<IAuthState>> = {
    signOut: state => {
        jwtService.destroyToken();
        jwtService.destroyRefreshToken();
        state.user = null;
    }
}
