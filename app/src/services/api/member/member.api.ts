import { BaseResponse, IChangeStatusRequest } from "@/types/common";
import { IMemberRequest, IMemberResetPassword, IMemberUpdate } from "@/types/member";
import authAxios from "@/utils/axios/auth.axios";

const memberApi = {
    fetchList: (payload: Record<string,string>) => {
        return authAxios.get<BaseResponse>('/admin/member/list', { params: payload });
    },
    getDetail: (id: string) => {
        return authAxios.get<BaseResponse>(`/admin/member/get/${id}`);
    },
    update: (payload: IMemberUpdate) => {
        const { id, ...rest } = payload;
        return authAxios.put<BaseResponse>(`/admin/member/update/${id}`, rest);
    },
    create: (payload: IMemberRequest) => {
        return authAxios.post<BaseResponse>("/admin/member/create", payload)
    },
    resetPassword: (payload: IMemberResetPassword) => {
        return authAxios.put<BaseResponse>(`/admin/member/reset-password`, payload)
    },
    changeStatus: (payload: IChangeStatusRequest) => {
        const {id, enabled} = payload
        return authAxios.put<BaseResponse>(`/admin/member/change-status/${id}`, {enabled: enabled})
    },
    export: (payload?: Record<string,string>) => {
        return authAxios.get<BaseResponse>(`/admin/member/export`, {params: payload});
    },
}

export default memberApi