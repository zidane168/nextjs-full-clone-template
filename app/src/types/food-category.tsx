import { Brand, CreatedBy, Name } from "./common"

export interface IFoodCategoryCreateRequest {
    name: Name
    thumbnailId: number
    sort: number
    brandId: number
    enabled: boolean
}
export interface IFoodCategory {
    name: Name
    thumbnail: string
    sort: number
    enabled: boolean
    brand: Brand
    id: number
    createdBy: CreatedBy
    updatedBy: any
}
export interface IFoodCategoryUpdateRequest extends IFoodCategoryCreateRequest {
    id: string | number
}

export interface IFoodCategoryDeleteRequest {
    id: string | number
}
export interface IFoodCategoryDetailRequest {
    id: string | number
}

export interface IFoodCategoryReducerState {
    list: IFoodCategory[]
    isLoadList: boolean
    item: IFoodCategory
}
