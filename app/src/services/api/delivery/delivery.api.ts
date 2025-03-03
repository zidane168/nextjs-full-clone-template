import { BaseResponse, IDeleteRequest, IDetailRequest } from "@/types/common"
import { IDeliveryCreateRequest, IDeliveryUpdateRequest } from "@/types/delivery"
import authAxios from "@/utils/axios/auth.axios"

const deliveryApi = {
    fetchList: () => {
        return authAxios.get<BaseResponse>("/admin/delivery/list")
    },
    fetchRegionDetail: (payload: IDetailRequest) => {
        return authAxios.get<BaseResponse>(`/admin/delivery/get/${payload.id}`)
    },
    updateDelivery: (payload: IDeliveryUpdateRequest) => {
        const { id, ...rest } = payload
        return authAxios.put<BaseResponse>(`/admin/delivery/update/${id}`, rest)
    },
    createDelivery: (payload: IDeliveryCreateRequest) => {
        return authAxios.post<BaseResponse>("/admin/delivery/create", payload)
    },
    deleteDelivery: (payload: IDeleteRequest) => {
        return authAxios.delete<BaseResponse>(`/admin/delivery/delete/${payload.id}`)
    },
}

export default deliveryApi
