import { IFieldLanguage } from "./common"

export interface IBrand {
    id: number
    name: IFieldLanguage
    sort: number
    enabled: boolean
    createdAt: Date
    code?: string
    updatedAt: Date
    createdBy: {
        id: number
        name: string
    }
    updatedBy: {
        id: number
        name: string
    }
}

export interface IBrandFormData {
    name: IFieldLanguage
    typeName: IFieldLanguage
    thumbnailId: number
    enabled: boolean
}

export interface IBrandCreateRequest extends IBrandFormData {}

export interface IBrandUpdateRequest extends IBrandFormData {
    id: string
}

export interface IBrandState {
    list: IBrand[]
    isLoadList: boolean
    item: IBrand
}
