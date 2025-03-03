import { Content, CreatedBy, Name } from "./common"

export interface ICompanyCreate {
    name: Name
    content: Content
    coverImageId: number
    enabled: boolean
}

export interface ICompanyDelete {
    id: number | string
}
export interface ICompanyUpdate extends ICompanyCreate {
    id: number | string
}

export interface ICompanyDetailRequest {
    id: number | string
}

export interface ICompany {
    name: Name
    content: Content
    coverImage: string
    enabled: boolean
    id: number
    createdBy: CreatedBy
    updatedBy: any
}

export interface ICompanyReducerState {
    list: ICompany[]
    isLoadList: Boolean
    item: ICompany
}
