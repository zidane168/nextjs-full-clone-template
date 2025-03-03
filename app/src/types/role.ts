import { IPermissionSub } from "./user";

export interface IRoleState {
    list: IRole[]
    isLoadList: boolean
    item: IRole,
}

export interface IRole {
    id: number,
    title: string,
    description: string,
    enabled: boolean,
    permissions: IPermissionSub[],
    updatedAt: string,
    createdAt: string,
}

export interface ISelectorRole extends Omit<IRole, 'permissions'> {
    permissions: {
        [k: string]: string[]
    }
}

export interface IRoleCreateUpdateForm {
    title?: string,
    description: string,
    permissions: number[],
    enabled: boolean,
}

export interface IRoleUpdateRequest extends IRoleCreateUpdateForm{ 
    id: string
}

export interface IRoleCreateRequest {
    title?: string,
    description: string,
    permissions?: number[]
    enabled: boolean,
}