import {
    DETAIL_DATA_TYPE,
    FOOD_INVOICE_STATUS,
    MEMBER_INVOICE_STATUS,
    MULTI_LANGUAGE_FIELD,
    PRODUCT_INVOICE_STATUS,
    TABLE_CELL_DATA_TYPE,
} from "@/utils/constants"
import { Control } from "react-hook-form"

export interface ILayoutParams {
    locale: string
}

export interface ILoginRequest {
    email: string
    password: string
}

export interface BaseResponse {
    statusCode: Number | string
    message: string
    _metadata: any
    data: any
}

export interface IHeading {
    key: string
    type: TABLE_CELL_DATA_TYPE
    keyLabel: string
}

export interface IDetailField {
    key: string
    type: DETAIL_DATA_TYPE
    keyLabel: string
}

export interface IPagination {
    perPage: number
    total: number
    totalPage: number
}

export interface IListRequest {
    params?: Record<string, string>
    perPage: number
    page: number
    orderBy: string
    orderDirection: string
}

export interface IDetailRequest {
    id: number
}

export interface IDeleteRequest {
    id: number
}

export interface IChangeStatusRequest {
    id: number
    enabled: boolean
}

export interface IChangeUsedRequest {
    id: number
}

export interface IChangeStatusMemberInvoiceRequest {
    id: number
    status: MEMBER_INVOICE_STATUS
}

export interface IChangeStatusInvoiceRequest {
    id: number
    status: FOOD_INVOICE_STATUS | PRODUCT_INVOICE_STATUS
}

export interface IFieldLanguage {
    en: string
    tc: string
    sc: string
}

export interface IFilterPagingClientSide {
    data: any[]
    totalRecords: number
}
export interface IUserAdmin {
    name: string
    id: number
}

export interface IBaseModel {
    enabled: boolean
    createdAt: Date
    updatedAt?: Date
    createdById: string
    updatedById?: string
    createdBy?: IUserAdmin
    updatedBy?: IUserAdmin
}

export interface ILanguageList {
    alias: string
    name: string
}

export interface ISelectOption {
    value: string | number
    label: string
    type?: string
}

export interface IMultiLanguageField {
    arrayParent?: string
    nestedArray?: string
    name: string
    type: MULTI_LANGUAGE_FIELD
}

export interface IMultiSelectFieldProp {
    name: string
    label: string
    control: Control<any>
    disabled?: boolean
    options: any
    isAllOption?: boolean
    defaultValue?: any
}

export interface IErrorResponse {
    property: string
    message: string
}

export interface IMediaItem {
    id: number
    sort: number
}

export interface IMedia {
    add: IMediaItem[]
    edit: IMediaItem[]
    delete: string[]
}

export interface CountryType {
    code: string
    label: string
    phone: string
    suggested?: boolean
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

export interface CreatedBy {
    id: number
    name: string
}

export interface UpdatedBy {
    id: number
    name: string
}

export interface Address {
    en: string
    tc: string
    sc: string
}

export interface Time {
    en: string
    tc: string
    sc: string
}

export interface Introduction {
    en: string
    tc: string
    sc: string
}

export interface Brand {
    id: number
    name: Name
}
export interface Extra {
    id?: number | string
    name: Name
    price: number
    sort: number
}

export interface UpdateExtra extends Extra {
    initId: string | number
}

export interface Category {
    id: number
    name: Name
    enabled: boolean
}

export interface DimensionFile {
    size: number
    width: number
    height: number
}

export interface IMedias {
    id: number | string
    url: string
}

export interface IStoreTimes {
    day: number
    open: string
    close: string
    id?: string
    initId?: string
}
