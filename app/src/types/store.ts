import { Address, Brand, CreatedBy, IFieldLanguage, Introduction, IStoreTimes, Name, Time } from "./common"

export interface IStoreCreateRequest {
    name: Name
    code: string
    address: Address
    time: Time
    introduction: Introduction
    phone: string
    facebook: string
    longitude: number
    latitude: number
    thumbnailId: number
    coverImageId: number
    brandId: number
    enabled: boolean
    times: IStoreTimes[]
    holidays: Holiday[]
}

export interface IStoreUpdateRequest extends IStoreCreateRequest {
    id: string | number
    removeTimeIds: number[]
}
export interface IStoreDetailRequest {
    id: string | number
}
export interface IStoreDeleteRequest extends IStoreDetailRequest {}
export interface IStore {
    name: IFieldLanguage
    code: string
    address: Address
    time: Time
    phone: string
    facebook: string
    longitude: number
    latitude: number
    thumbnail: string
    coverImage: string
    enabled: boolean
    brand: Brand
    id: number
    createdBy: CreatedBy
    updatedBy: any
    times: IStoreTimes[]
    holidays: Holiday[]
}

export interface Holiday {
    id?: string | number
    day: string
}

export interface IStoreReducerState {
    list: IStore[]
    isLoadList: boolean
    item: IStore
}
