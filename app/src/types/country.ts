import { IFieldLanguage, IUserAdmin } from "./common"

export interface ICountry {
    code: string
    flag: string
    name: IFieldLanguage
    enabled: boolean
    createdAt: Date
    updatedAt: Date
    createdBy: IUserAdmin
    updatedBy: IUserAdmin
    id: string
}

export interface ICountryState {
    list: ICountry[]
    isLoadList: boolean
    item: ICountry
}
