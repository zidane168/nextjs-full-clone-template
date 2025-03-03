import { BaseResponse, IChangeStatusRequest, IDetailRequest } from "@/types/common";
import { IUserCreateRequest, IUserUpdateRequest } from "@/types/user";
import authAxios from "@/utils/axios/auth.axios";

const administratorApi = {
    fetchList: () => {
        return authAxios.get<BaseResponse>('/admin/user/list');
    },
    fetchUserDetail: (payload:IDetailRequest) => {
        return authAxios.get<BaseResponse>(`/admin/user/get/${payload.id}`);
    },
    createUser: (payload: IUserCreateRequest) => {
        return authAxios.post<BaseResponse>('/admin/user/create', payload);
    },
    updateUser: (payload: IUserUpdateRequest) => {
        const { id, ...rest} = payload
        return authAxios.put<BaseResponse>(`/admin/user/update/${id}`, rest);
    },
    changeStatusUser: (payload: IChangeStatusRequest) => {
        const {id, enabled} = payload
        return authAxios.put<BaseResponse>(`/admin/user/update-status/${id}`, {enabled: enabled})
    },
}

export default administratorApi