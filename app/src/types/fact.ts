import { IFieldLanguage } from "./common"

export interface IFact {
    categoryId: number
    slug: string
    name: IFieldLanguage
    content: IFieldLanguage
    type: string
    enabled: boolean
    createAt: Date
    updateAt: Date
    createBy: number
    updateBy: number
    id: number

    thumbnail: string | number
}

export interface IFactRequest {
    name: IFieldLanguage
    content: IFieldLanguage
    type: string
    thumbnailId: number
    enabled: boolean
}

export interface IFactUpdate extends IFactRequest {
    id: number
}

export interface IFactState {
    list: IFact[]
    isLoadList: boolean
    item: IFact
}
