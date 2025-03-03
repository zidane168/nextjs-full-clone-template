import { Content, CreatedBy, Name } from "./common"

export interface INewCreateRequest {
    name: Name
    content: Content
    eventDate: string
    published: string
    unpublished: string
    thumbnailId: number
    contentImageId: number
    sort: number
    enabled: boolean
}

export interface INewUpdateRequest extends INewCreateRequest {
    id: number | string
}

export interface INewDetailRequest {
    id: number | string
}

export interface INewDeleteRequest extends INewDetailRequest {}

export interface INew {
    name: Name
    content: Content
    published: string
    unpublished: string
    thumbnail: string
    contentImage: string
    sort: number
    enabled: boolean
    id: number
    createdBy: CreatedBy
    updatedBy: any
}

export interface INewReducerState {
    list: INew[]
    isLoadList: Boolean
    item: INew
}
