import { BaseResponse } from "@/types/common"
import { IStoreCreateRequest, IStoreDeleteRequest, IStoreUpdateRequest } from "@/types/store"
import authAxios from "@/utils/axios/auth.axios"

const storeApi = {
    fetchList: () => {
        return authAxios.get<BaseResponse>("/admin/store/list")
    },
    fetchStoreDetail: (payload: IStoreDeleteRequest) => {
        return authAxios.get<BaseResponse>(`/admin/store/get/${payload.id}`)
    },
    updateStore: (payload: IStoreUpdateRequest) => {
        const { id, ...rest } = payload
        return authAxios.put<BaseResponse>(`/admin/store/update/${id}`, rest)
    },
    createStore: (payload: IStoreCreateRequest) => {
        return authAxios.post<BaseResponse>("/admin/store/create", payload)
    },
    deleteStore: (payload: IStoreDeleteRequest) => {
        return authAxios.delete<BaseResponse>(`/admin/store/delete/${payload.id}`)
    },
}

export default storeApi
