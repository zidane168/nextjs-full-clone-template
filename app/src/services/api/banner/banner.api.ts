import authAxios from "@/utils/axios/auth.axios"
import { BaseResponse, IChangeStatusRequest, IDeleteRequest, IDetailRequest } from "@/types/common"
import { IBannerCreateRequest, IBannerUpdateRequest } from "@/types/banner"

const bannerApi = {
    fetchBanners: () => {
        return authAxios.get<BaseResponse>("/admin/banner/list")
    },
    fetchBannerDetail: (payload: IDetailRequest) => {
        return authAxios.get<BaseResponse>(`/admin/banner/get/${payload.id}`)
    },
    updateBanner: (payload: IBannerUpdateRequest) => {
        const { id, ...rest } = payload
        return authAxios.put<BaseResponse>(`/admin/banner/update/${id}`, rest)
    },
    createBanner: (payload: IBannerCreateRequest) => {
        return authAxios.post<BaseResponse>("/admin/banner/create", payload)
    },
    deleteBanner: (payload: IDeleteRequest) => {
        return authAxios.delete<BaseResponse>(`/admin/banner/delete/${payload.id}`)
    },
    changeStatusBanner: (payload: IChangeStatusRequest) => {
        const {id, enabled} = payload
        return authAxios.put<BaseResponse>(`/admin/banner/update-status/${id}`, {enabled: enabled})
    },
}

export default bannerApi
