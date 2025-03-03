import { IFieldLanguage } from "./common"

export interface IDistrict {
    id: number
    countryId: number
    name: IFieldLanguage
    enabled: boolean
    createdAt: Date
    updatedAt: Date
    createdBy: number
    updatedBy: number
}
export interface IRegion {
    code: string
    name: {
        en: string
        tc: string
    }
    enabled: boolean
    id: number
}
export interface IDistrictFormData {
    countryId: number
    name: IFieldLanguage
    enabled: boolean
}

export interface IDistrictCreateRequest extends IDistrictFormData {}

export interface IDistrictUpdateRequest extends IDistrictFormData {
    id: string
}

export interface IDistrictState {
    list: IDistrict[]
    isLoadList: boolean
    item: IDistrict
}

export interface IRegionState {
    list: IRegion[]
    isLoadList: boolean
    item: IRegion
}
