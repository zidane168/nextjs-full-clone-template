import authAxios from "@/utils/axios/auth.axios"
import { BaseResponse, IChangeStatusRequest, IDeleteRequest, IDetailRequest } from "@/types/common"
import { IFactCategoryCreateRequest, IFactCategoryUpdateRequest } from "@/types/factCategory"

const factCategoryApi = {
    fetchFactCategories: () => {
        return authAxios.get<BaseResponse>("/admin/fact-category/list")
    },
    fetchFactCategoryDetail: (payload: IDetailRequest) => {
        return authAxios.get<BaseResponse>(`/admin/fact-category/get/${payload.id}`)
    },
    updateFactCategory: (payload: IFactCategoryUpdateRequest) => {
        const { id, ...rest } = payload
        return authAxios.put<BaseResponse>(`/admin/fact-category/update/${id}`, rest)
    },
    createFactCategory: (payload: IFactCategoryCreateRequest) => {
        return authAxios.post<BaseResponse>("/admin/fact-category/create", payload)
    },
    deleteFactCategory: (payload: IDeleteRequest) => {
        return authAxios.delete<BaseResponse>(`/admin/fact-category/delete/${payload.id}`)
    },
    changeStatusFactCategory: (payload: IChangeStatusRequest) => {
        const {id, enabled} = payload
        return authAxios.put<BaseResponse>(`/admin/fact-category/update-status/${id}`, {enabled: enabled})
    },
}

export default factCategoryApi
