import { BaseResponse } from "@/types/common"
import {
    INewCreateRequest,
    INewDeleteRequest,
    INewDetailRequest,
    INewUpdateRequest,
} from "@/types/news"
import authAxios from "@/utils/axios/auth.axios"

const newsApi = {
    fetchList: () => {
        return authAxios.get<BaseResponse>("/admin/news/list")
    },
    fetchNewsDetail: (payload: INewDetailRequest) => {
        return authAxios.get<BaseResponse>(`/admin/news/get/${payload.id}`)
    },
    updateNews: (payload: INewUpdateRequest) => {
        const { id, ...rest } = payload
        return authAxios.put<BaseResponse>(`/admin/news/update/${id}`, rest)
    },
    createNews: (payload: INewCreateRequest) => {
        return authAxios.post<BaseResponse>("/admin/news/create", payload)
    },
    deleteNews: (payload: INewDeleteRequest) => {
        return authAxios.delete<BaseResponse>(`/admin/news/delete/${payload.id}`)
    },
}

export default newsApi
