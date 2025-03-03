import { BaseResponse } from "@/types/common"
import {
    IEShopUpdate
} from "@/types/eShop"
import authAxios from "@/utils/axios/auth.axios"

const eShopApi = {
    fetchList: () => {
        return authAxios.get<BaseResponse>("/admin/eshop/list")
    },
    updateEShop: (payload: IEShopUpdate) => {
        const { id, enabled } = payload
        return authAxios.put<BaseResponse>(`/admin/eshop/update/${id}`, {enabled: enabled})
    },
}

export default eShopApi
