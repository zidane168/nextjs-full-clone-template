import { IPagination } from "./common"

export interface IMemberState {
    list: IMember[]
    isLoadList: boolean
    pagination: IPagination
    item: IMember
}

export interface IMember {
    id: number
    title: ITitle
    avatar: string
    password: string
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isNotifiable: boolean
    phone: string
    locale: string
    email: string
    dob: Date, 
    name: string,
    gender: IGender
    enabled: boolean
    createdAt: Date
    updatedAt: Date
    createdBy: number
    updatedBy: number
    deletedAt: Date
    deletedReason: string
    deletedBy: number
    createdByUser: any
    updatedByUser: any
}

export enum IGender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}

export enum ITitle {
    MR = 'MR',
    MS = 'MS',
}

export interface IMemberRequest {
    title: ITitle
    email: string
    dob: string,
    name: string,
    gender: 0 | 1 | 2 | string
    avatarId: number
}

export type IMemberUpdate = IMemberRequest & {
    id: string
}

export interface IMemberResetPassword {
    country?: string
    phone?: string
    email?: string
}
