import { BaseResponse, IChangeStatusRequest } from "@/types/common"
import { IChickenPotProductCreate, IChickenPotProductUpdate } from "@/types/product"
import authAxios from "@/utils/axios/auth.axios"

const productApi = {
    fetchList: (data: Record<string, string>) => {
        return authAxios.get<BaseResponse>("/admin/product/list", {
            params: data,
        })
    },
    getDetail: (id: string) => {
        return authAxios.get<BaseResponse>(`/admin/product/get/${id}`)
    },
    update: (payload: IChickenPotProductUpdate) => {
        const { id, ...rest } = payload
        return authAxios.put<BaseResponse>(`/admin/product/update/${id}`, rest)
    },
    create: (payload: IChickenPotProductCreate) => {
        return authAxios.post<BaseResponse>("/admin/product/create", payload)
    },
    changeStatus: (payload: IChangeStatusRequest) => {
        const { id, enabled } = payload
        return authAxios.put<BaseResponse>(`/admin/product/update-status/${id}`, {
            enabled: enabled,
        })
    },
    fetchListData: (data: Record<string, string>) => {
        return authAxios.get<BaseResponse>("/public/product/list", {
            params: data,
        })
    },
}

export default productApi
