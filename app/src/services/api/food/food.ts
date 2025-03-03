import { BaseResponse } from "@/types/common"

import { IFoodCreateRequest, IFoodDeleteRequest, IFoodUpdateRequest } from "@/types/food"
import { authAxios } from "@/utils/axios"

const foodApi = {
    fetchList(payload: Record<string,string>) {
        return authAxios.get<BaseResponse>("/admin/food/list", { params: payload })
    },
    getDetail(id: string) {
        return authAxios.get<BaseResponse>(`/admin/food/get/${id}`)
    },
    create(payload: IFoodCreateRequest) {
        return authAxios.post<BaseResponse>("/admin/food/create", payload)
    },
    update(payload: IFoodUpdateRequest) {
        const { id, ...rest } = payload
        return authAxios.put<BaseResponse>(`/admin/food/update/${id}`, rest)
    },
    delete: (payload: IFoodDeleteRequest) => {
        return authAxios.delete<BaseResponse>(`/admin/food/delete/${payload.id}`)
    },
}

export default foodApi
