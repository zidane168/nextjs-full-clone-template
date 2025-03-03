import { BaseResponse, IDetailRequest } from "@/types/common";
import { authAxios } from "@/utils/axios";

const memberDeviceApi = {
    fetchMemberDevices(payload: Record<string,string>){
        return authAxios.get<BaseResponse>('/admin/member-device/list', {params: payload})
    },
    fetchMemberDeviceDetail: (payload: IDetailRequest) => {
        return authAxios.get<BaseResponse>(`/admin/member-device/get/${payload.id}`);
    },
}

export default memberDeviceApi;