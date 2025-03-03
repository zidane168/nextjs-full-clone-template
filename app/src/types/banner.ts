import { BANNER_TYPE } from "@/utils/constants"
import { IFieldLanguage } from "./common"

export interface IBannerState {
    list: IBanner[]
    isLoadList: boolean
    item: IBanner
}

export interface IBanner {
    id: number
    title: IFieldLanguage
    type: BANNER_TYPE
    url: string
    urlId: number | string
    mime: string
    brief: IFieldLanguage
    sort: number
    updatedBy: {
        id: number
        name: string
    }
    createdBy: {
        id: number
        name: string
    }
    updatedAt: string
    createdAt: string
    enabled: boolean
}

export interface IBannerFormData {
    name: IFieldLanguage
    type: string
    module: string
    sort: number
    urlId: number
    enabled: boolean
}

export interface IBannerCreateRequest extends IBannerFormData {}

export interface IBannerUpdateRequest extends IBannerFormData {
    id: string
}
