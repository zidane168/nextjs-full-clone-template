import { SETTING_TYPE } from "@/utils/constants"

export interface ISetting {
    id: number,
    name: string,
    description: string,
    type: SETTING_TYPE,
    value: string | boolean | number,
    createdAt: Date,
    updatedAt: Date,
}

export interface ISettingFormData {
    value: string | boolean | number
}

export interface ISettingUpdateRequest extends ISettingFormData { 
    id: string,
}


export interface ISettingState {
    list: ISetting[],
    isLoadList: boolean,
    item: ISetting,
}
