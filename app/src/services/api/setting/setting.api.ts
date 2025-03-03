import { BaseResponse, IDetailRequest } from "@/types/common";
import { ISettingUpdateRequest } from "@/types/setting";
import authAxios from "@/utils/axios/auth.axios";

const settingApi = {
    fetchList: () => {
        return authAxios.get<BaseResponse>('/admin/setting/list');
    },
    fetchSettingDetail: (payload: IDetailRequest) => {
        return authAxios.get<BaseResponse>(`/admin/setting/get/${payload.id}`)
    },
    updateSetting: (payload: ISettingUpdateRequest) => {
        const { id, ...rest } = payload
        return authAxios.put<BaseResponse>(`/admin/setting/update/${id}`, rest)
    },
}

export default settingApi