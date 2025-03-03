import { Brand, Category, Content, CreatedBy, IFieldLanguage, IMedias, IPagination, Name, UpdateExtra } from "./common"

export interface IFoodCreateRequest {
    brandId: number
    categoryId: number
    name: Name
    content: Content
    thumbnailId: number
    coverImageId: number
    thumbnail?: string
    coverImage?: string
    published: string
    unpublished: string
    price: number
    discount: number
    popular: boolean
    bestSeller: boolean
    quantity: number
    sort: number
    enabled: boolean
    isHaveExtras?: boolean
    extras: IExtra[]
    updateExtras?: IExtra[]
    deleteExtraDetailIds?: number[]
    deleteExtraIds?: number[]
}
export interface IFoodUpdateRequest extends IFoodCreateRequest {
    id: number | string
}
export interface IFoodDeleteRequest {
    id: number | string
}
export interface IFood {
    name: Name
    content: Content
    thumbnail: string
    coverImage: string
    thumbnailId: number
    coverImageId: number
    published: string
    unpublished: string
    price: number
    discount: number
    popular: boolean
    bestSeller: boolean
    quantity: number
    quantityPurchased: number
    quantityWaiting: number
    sort: number
    enabled: boolean
    brand: Brand
    category: Category
    extras: IExtra[]
    id: number
    createdBy: CreatedBy
    updatedBy: any
    medias: IMedias[]
}

export interface IFoodReducerState {
    list: IFood[]
    isLoadList: boolean
    pagination: IPagination
    item: IFood
}

export interface IExtra {
    id: string
    name: IFieldLanguage
    limit: number
    reqOpt: boolean
    details: IDetailExtra[]
    sort: number
}

export interface IDetailExtra {
    id: string
    name: IFieldLanguage
    price: number
    sort: number
}
