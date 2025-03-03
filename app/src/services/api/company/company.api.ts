import { BaseResponse } from "@/types/common"
import {
    ICompanyCreate,
    ICompanyDelete,
    ICompanyDetailRequest,
    ICompanyUpdate
} from "@/types/company"
import authAxios from "@/utils/axios/auth.axios"

const companyApi = {
    fetchList: () => {
        return authAxios.get<BaseResponse>("/admin/company/list")
    },
    fetchCompanyDetail: (payload: ICompanyDetailRequest) => {
        return authAxios.get<BaseResponse>(`/admin/company/get/${payload.id}`)
    },
    updateCompany: (payload: ICompanyUpdate) => {
        const { id, ...rest } = payload
        return authAxios.put<BaseResponse>(`/admin/company/update/${id}`, rest)
    },
    createCompany: (payload: ICompanyCreate) => {
        return authAxios.post<BaseResponse>("/admin/company/create", payload)
    },
    deleteCompany: (payload: ICompanyDelete) => {
        return authAxios.delete<BaseResponse>(`/admin/company/delete/${payload.id}`)
    },
}

export default companyApi
