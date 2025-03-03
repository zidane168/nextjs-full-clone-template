import { IFieldLanguage } from "./common"

export interface IDelivery {
    name: Name
    thumbnail: string
    url: string
    enabled: boolean
    id: number
    createdBy: CreatedBy
    updatedBy: any
}
export interface IDeliveryState {
    list: IDelivery[]
    isLoadList: boolean
    item: IDelivery | IDeliveryFormdata
}
export interface Name {
    en: string
    tc: string
    sc: string
}

export interface CreatedBy {
    id: number
    name: string
}

export interface IDeliveryFormdata {
    name: IFieldLanguage
    url: string
    thumbnailId: number
    thumbnail: string | undefined
    enabled: boolean
    deliveryItems: IDeliveryItem[]
}

export interface IDeliveryItem {
    name: IFieldLanguage
    url: string
    thumbnailId: number | undefined
    thumbnail: string | undefined
}

export interface IDeliveryCreateRequest extends IDeliveryFormdata {}

export interface IDeliveryUpdateRequest extends IDeliveryFormdata {
    id: string
}
