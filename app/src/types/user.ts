import { IRole } from "./role"

export interface IAuthState {
    user?: ILoginUser | null
    masterData: any
    isLoadMasterdata: boolean
}

export interface IPermissionSub {
    id: number
    subject: string
    actions: string[]
}

export interface IPermissionContainer {
    container: string
    subjects: IPermissionSub[]
}

export interface ILoginUser {
    id: Number
    email?: string
    phone?: string
    name: string
    loginDate?: string
    createdAt?: Date
    permissions: IPermissionContainer[]
}

export interface IUser {
    id: number
    email: string
    phone: string
    name: string
    signUpFrom: string
    createdBy: {
        id: number
        name: string
    }
    updatedBy: {
        id: number
        name: string
    }
    enabled: boolean
    createdAt?: Date
    updatedAt?: Date
    isKitchen: boolean
    roles: INestedRole[]
}

export interface INestedRole {
    role: IRole
}

export interface IUserState {
    list: IUser[]
    isLoadList: boolean
    item: IUser
}

export interface IUserFormData{
    name?: string
    phone?: string
    email: string
    password?: string
    roleId?: number | null
    oldPassword?: string
    newPassword?: string
    isKitchen: boolean
    enabled: boolean
}

export interface IUserCreateRequest extends IUserFormData{}

export interface IUserUpdateRequest extends IUserFormData{
    id: string
}