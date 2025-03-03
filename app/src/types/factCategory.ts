import { FACT_TYPE } from "@/utils/constants"
import { IFieldLanguage } from "./common"

export interface IFactCategoryState {
    list: IFactCategory[]
    isLoadList: boolean
    item: IFactCategory,
}

export interface IFactItem {
    createdBy: number
    updatedBy: number
    createdAt: string
    updatedAt: string
    enabled: boolean
    id: number
    categoryId: number
    name: IFieldLanguage
    content: IFieldLanguage
    type: FACT_TYPE
    thumbnail: string
    category: {
        name: IFieldLanguage
    }
}

export interface IFactCategory {
    id: number
    name: IFieldLanguage
    type: FACT_TYPE
    updatedBy: {
        id: number,
        name: string,
    }
    createdBy: {
        id: number,
        name: string,
    }
    updatedAt: string,
    createdAt: string,
    thumbnail: string,
    enabled: boolean,
    facts: IFactItem[]
}

export interface IFactCategoryFormData {
    name: IFieldLanguage
    factType: FACT_TYPE
    enabled: boolean
}

export interface IFactCategoryCreateRequest extends IFactCategoryFormData {}

export interface IFactCategoryUpdateRequest extends IFactCategoryFormData { 
    id: string,
}
