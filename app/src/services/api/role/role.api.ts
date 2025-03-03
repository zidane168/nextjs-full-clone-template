import authAxios from "@/utils/axios/auth.axios";
import { BaseResponse, IChangeStatusRequest, IDeleteRequest, IDetailRequest } from "@/types/common";
import { IRoleCreateRequest, IRoleUpdateRequest } from "@/types/role";

const roleApi = {
    fetchRoles: () => {
        return authAxios.get<BaseResponse>('/admin/role/list');
    },
    fetchRoleDetail: (payload:IDetailRequest) => {
        return authAxios.get<BaseResponse>(`/admin/role/get/${payload.id}`);
    },
    updateRole: (payload:IRoleUpdateRequest) => {
        const { id, ...rest } = payload
        return authAxios.put<BaseResponse>(`/admin/role/update/${id}`, rest);
    },
    createRole: (payload:IRoleCreateRequest) => {
        return authAxios.post<BaseResponse>('/admin/role/create', payload);
    },
    deleteRole: (payload:IDeleteRequest) => {
        return authAxios.delete<BaseResponse>(`/admin/role/delete/${payload.id}`);
    },
    changeStatusRole: (payload: IChangeStatusRequest) => {
        const {id, enabled} = payload
        return authAxios.put<BaseResponse>(`/admin/role/update-status/${id}`, {enabled: enabled})
    },
}

export default roleApi