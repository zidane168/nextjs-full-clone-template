import { FOOD_INVOICE_STATUS } from "@/utils/constants"
import { IFieldLanguage, IPagination } from "./common"
import { IExtra } from "./food"

export interface IInvoiceFoodState {
    list: IInvoiceFood[]
    pagination: IPagination
    item: IInvoiceFoodDetail
}

export interface IInvoiceFood {
    id: number
    invoiceNumber: string
    pickupDate: string
    pickupTime: string
    subtotal: number
    dícount: number
    total: number
    method: string
    enabled: boolean
    status: FOOD_INVOICE_STATUS
    createdAt: string
    updatedAt: string
    member: {
        id: number
        title: string
        name: string
        email: string
        phone: string
        dob: string
        gender: string
        isNotifiable: boolean
        isEmailVerified: boolean
        isPhoneVerified: boolean
        enabled: boolean
        createdAt: string
        updatedAt: string
    }
    store: {
        id: number
        createdBy: number
        updatedBy: number
        name: IFieldLanguage
        code: string
        address: IFieldLanguage
        introduction: IFieldLanguage
        time: IFieldLanguage
        phone: string
        facebook: string
        longitude: number
        latitude: number
        thumbnail: string
        coverImage: string
        enabled: boolean
    }
}

export interface IInvoiceFoodDetail extends IInvoiceFood {
    items: IInvoiceFoodItem[]
}

export interface IInvoiceFoodItem {
    quantity: number
    price: number
    unitPrice: number
    food: {
        name: IFieldLanguage
        thumbnail: string
        published: string
        unpublished: string
        discount: number
        sort: number
        enabled: boolean
        id: number
    },
    extras: IExtra[]
}
