import { Content, CreatedBy, Name } from "./common"
export interface IContactInfoCreateRequest {
    name: Name
    content: Content
    phone: string
    email: string
    coverImageId: number
    enabled: boolean
}

export interface IContactInfo {
    name: Name
    content: Content
    phone: string
    email: string
    coverImage: string
    enabled: boolean
    id: number
    createdBy: CreatedBy
    updatedBy: any
}

export interface IContactInfoUpdateRequest extends IContactInfoCreateRequest {
    id: string | number
}
export interface IContactInfoDeleteRequest {
    id: string | number
}

export interface IContactInfoReducerState {
    list: IContactInfo[]
    isLoadList: boolean
    item: IContactInfo
}
