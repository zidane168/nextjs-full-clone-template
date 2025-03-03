export interface IPermission {
    id: number
    createdBy: number
    updatedBt: number
    title: string
    description: string
    action: string
    subject: string
    visibled: boolean
    enabled: boolean
    createdAt: string
    updatedAt: string
}

export interface ISelectorPermission {
    [k: string]: Array<{ id: number; action: string }>
}

export interface IPermissionState {
    list: IPermission[]
    isLoadList: boolean
}
