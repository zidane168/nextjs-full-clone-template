import { MEMBER_DEVICE_TYPE } from "@/utils/constants"
import { IPagination } from "./common"

export interface IMemberDeviceState {
    list: IMemberDevice[]
    pagination: IPagination
    item: IMemberDevice
}

export interface IMemberDevice {
    id: number
    memberId: number
    type: MEMBER_DEVICE_TYPE | string
    model: string
    version: string
    token: string
    member: {
        phone: string
        firstName: string
        lastName: string
    }
}
