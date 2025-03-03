import { BaseResponse, IDeleteRequest, IDetailRequest } from "@/types/common";
import { IDistrictCreateRequest, IDistrictUpdateRequest } from "@/types/district";
import authAxios from "@/utils/axios/auth.axios";

const districtApi = {
    fetchList: () => {
        return authAxios.get<BaseResponse>('/admin/district/list');
    },
    fetchDistrictDetail: (payload: IDetailRequest) => {
        return authAxios.get<BaseResponse>(`/admin/district/get/${payload.id}`)
    },
    updateDistrict: (payload: IDistrictUpdateRequest) => {
        const { id, ...rest } = payload
        return authAxios.put<BaseResponse>(`/admin/district/update/${id}`, rest)
    },
    createDistrict: (payload: IDistrictCreateRequest) => {
        return authAxios.post<BaseResponse>("/admin/district/create", payload)
    },
    deleteDistrict: (payload: IDeleteRequest) => {
        return authAxios.delete<BaseResponse>(`/admin/district/delete/${payload.id}`)
    },
}

export default districtApi