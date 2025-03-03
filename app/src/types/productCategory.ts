import { IFieldLanguage } from "./common"

export interface IProductCategory {
    name: IFieldLanguage
    sort: number
    enabled: boolean
    createdAt: string
    updatedAt: string
    id: number
    createdBy: {
        id: number
        name: string
    }
    updatedBy: {
        id: number
        name: string
    }
}

export interface IProductCategoryDetail extends IProductCategory {}

export interface IProductCategoryRequest {
    name: IFieldLanguage
    sort: number
    enabled: boolean
    thumbnailId: number
}

export interface IProductCategoryUpdate extends IProductCategoryRequest {
    id: string
}

export interface IProductCategoryState {
    list: IProductCategory[]
    item: IProductCategoryDetail
    isLoadList: boolean
}
