import { BaseResponse } from "@/types/common"
import authAxios from "@/utils/axios/auth.axios"
import {
    IContactInfoCreateRequest,
    IContactInfoDeleteRequest,
    IContactInfoUpdateRequest,
} from "./../../../types/contactInfo"

const contact_info_api = {
    fetchList: () => {
        return authAxios.get<BaseResponse>("/admin/contact-info/list")
    },
    getDetail: (id: string | number) => {
        return authAxios.get<BaseResponse>(`/admin/contact-info/get/${id}`)
    },
    update: (payload: IContactInfoUpdateRequest) => {
        const { id, ...rest } = payload
        return authAxios.put<BaseResponse>(`/admin/contact-info/update/${id}`, rest)
    },
    create: (payload: IContactInfoCreateRequest) => {
        return authAxios.post<BaseResponse>("/admin/contact-info/create", payload)
    },
    delete: (payload: IContactInfoDeleteRequest) => {
        return authAxios.delete<BaseResponse>(`/admin/contact-info/delete/${payload.id}`)
    },
}

export default contact_info_api
