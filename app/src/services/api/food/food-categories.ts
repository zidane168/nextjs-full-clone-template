import { BaseResponse } from "@/types/common"
import {
    IFoodCategoryCreateRequest,
    IFoodCategoryDeleteRequest,
    IFoodCategoryUpdateRequest,
} from "./../../../types/food-category"

import { authAxios } from "@/utils/axios"

const foodCategoryApi = {
    fetchList() {
        return authAxios.get<BaseResponse>("/admin/food-category/list")
    },
    getDetail(id: string) {
        return authAxios.get<BaseResponse>(`/admin/food-category/get/${id}`)
    },
    create(payload: IFoodCategoryCreateRequest) {
        return authAxios.post<BaseResponse>("/admin/food-category/create", payload)
    },
    update(payload: IFoodCategoryUpdateRequest) {
        const { id, ...rest } = payload
        return authAxios.put<BaseResponse>(`/admin/food-category/update/${id}`, rest)
    },
    delete: (payload: IFoodCategoryDeleteRequest) => {
        return authAxios.delete<BaseResponse>(`/admin/food-category/delete/${payload.id}`)
    },
}

export default foodCategoryApi
