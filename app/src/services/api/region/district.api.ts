import { BaseResponse, IDetailRequest } from "@/types/common"
import authAxios from "@/utils/axios/auth.axios"

const regionApi = {
    fetchList: () => {
        return authAxios.get<BaseResponse>("/admin/region/list")
    },
    fetchRegionDetail: (payload: IDetailRequest) => {
        return authAxios.get<BaseResponse>(`/admin/region/get/${payload.id}`)
    },
    // updateDistrict: (payload: IDistrictUpdateRequest) => {
    //     const { id, ...rest } = payload
    //     return authAxios.put<BaseResponse>(`/admin/district/update/${id}`, rest)
    // },
    // createDistrict: (payload: IDistrictCreateRequest) => {
    //     return authAxios.post<BaseResponse>("/admin/district/create", payload)
    // },
    // deleteDistrict: (payload: IDeleteRequest) => {
    //     return authAxios.delete<BaseResponse>(`/admin/district/delete/${payload.id}`)
    // },
}

export default regionApi
