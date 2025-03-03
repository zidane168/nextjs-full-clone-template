import { PRODUCT_INVOICE_STATUS } from "@/utils/constants"
import { IFieldLanguage, IPagination } from "./common"

export interface IInvoiceProductState {
    list: IInvoiceProduct[]
    pagination: IPagination
    item: IInvoiceProductDetail
}

export interface IInvoiceProduct {
    id: number
    invoiceNumber: string
    deliveryType: string
    shippingDate: string
    shippingBlockTime: string
    fullAddress: string
    subtotal: number
    deliveryFee: number
    discount: number
    total: number
    method: string
    enabled: boolean
    status: PRODUCT_INVOICE_STATUS
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
    memberAddress: {
        id: number
        addressTitle: string
        name: string
        phone: string
        address: string
        default: boolean
        enabled: boolean
    }
}

export interface IInvoiceProductDetail extends IInvoiceProduct {
    items: IInvoiceProductItem[]
}

export interface IInvoiceProductItem {
    quantity: number
    price: number
    product: {
        name: IFieldLanguage
        thumbnail: string
        published: string
        unpublished: string
        discount: number
        enabled: boolean
        id: number
    },
}
