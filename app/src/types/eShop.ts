import {  CreatedBy, UpdatedBy } from "./common"

export interface IEShop {
    enabled: boolean
    id: number
    createdBy: CreatedBy
    updatedBy: UpdatedBy
}

export interface IEShopReducerState {
    list: IEShop[]
    isLoadList: Boolean
}

export interface IEShopUpdate {
    id: number | string
    enabled: boolean
}


