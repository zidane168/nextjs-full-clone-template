import { BaseResponse, IDeleteRequest, IDetailRequest } from "@/types/common"
import { IBrandCreateRequest, IBrandUpdateRequest } from "@/types/brand"
import authAxios from "@/utils/axios/auth.axios"

const brandApi = {
    fetchList: () => {
        return authAxios.get<BaseResponse>("/admin/brand/list")
    },
    fetchBrandDetail: (payload: IDetailRequest) => {
        return authAxios.get<BaseResponse>(`/admin/brand/get/${payload.id}`)
    },
    updateBrand: (payload: IBrandUpdateRequest) => {
        const { id, ...rest } = payload
        return authAxios.put<BaseResponse>(`/admin/brand/update/${id}`, rest)
    },
    createBrand: (payload: IBrandCreateRequest) => {
        return authAxios.post<BaseResponse>("/admin/brand/create", payload)
    },
    deleteBrand: (payload: IDeleteRequest) => {
        return authAxios.delete<BaseResponse>(`/admin/brand/delete/${payload.id}`)
    },
}

export default brandApi
