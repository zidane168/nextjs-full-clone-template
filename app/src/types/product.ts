import { PAGINATION_DEFAULT } from "@/utils/constants"
import { IMedias, IPagination } from "./common"

export interface IChickenPotProductCreate {
    categoryId: number
    name: Name
    content: Content
    thumbnailId: number
    coverImageId: number
    published: string
    unpublished: string
    price: number
    discount?: number | string
    popular: boolean
    bestSeller: boolean
    quantity: number
    sort: number
    enabled: boolean
}
export interface IChickenPotProductUpdate extends IChickenPotProductCreate {
    id: string
    deleteMediaIds: number[]
}
export interface Name {
    en: string
    tc: string
    sc: string
}

export interface Content {
    en: string
    tc: string
    sc: string
}

//  Detail
export interface IChickenPotProductDetail {
    id: number
    createdBy: CreatedBy
    updatedBy: UpdatedBy
    category: Category
    name: Name
    content: Content
    thumbnail: string
    coverImage: string
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
    medias: IMedias[]
}

export interface CreatedBy {
    id: number
    name: string
}

export interface UpdatedBy {
    id: number
    name: string
}

export interface Category {
    id: number
    createdBy: number
    updatedBy: any
    name: Name
    thumbnail: string
    sort: number
    enabled: boolean
}

export interface IProductState {
    list: IChickenPotProductDetail[]
    pagination: IPagination
    item: IChickenPotProductDetail
    dataList: IChickenPotProductDetail[]
    isLoadDataList: boolean
}
