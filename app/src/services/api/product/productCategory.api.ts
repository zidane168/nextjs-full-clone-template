import { BaseResponse, IDeleteRequest } from "@/types/common"
import { IProductCategoryRequest, IProductCategoryUpdate } from "@/types/productCategory"
import { authAxios } from "@/utils/axios"

const ProductCategoryApi = {
    fetchList() {
        return authAxios.get<BaseResponse>("/admin/product-category/list")
    },
    getDetail(id: string) {
        return authAxios.get<BaseResponse>(`/admin/product-category/get/${id}`)
    },
    create(payload: IProductCategoryRequest) {
        return authAxios.post<BaseResponse>("/admin/product-category/create", payload)
    },
    update(payload: IProductCategoryUpdate) {
        const { id, ...rest } = payload
        return authAxios.put<BaseResponse>(`/admin/product-category/update/${id}`, rest)
    },
    delete: (payload: IDeleteRequest) => {
        return authAxios.delete<BaseResponse>(`/admin/product-category/delete/${payload.id}`)
    },
}

export default ProductCategoryApi
