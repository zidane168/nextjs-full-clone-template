import { BaseResponse, IChangeStatusRequest, IDeleteRequest } from "@/types/common";
import { IFactUpdate, IFactRequest } from "@/types/fact";
import authAxios from "@/utils/axios/auth.axios";

const factApi = {
    fetchList: () => {
        return authAxios.get<BaseResponse>('/admin/fact/list');
    },
    getDetail: (id: string) => {
        return authAxios.get<BaseResponse>(`/admin/fact/get/${id}`)
    },
    update: (payload: IFactUpdate) => {
        const {id, ...rest} = payload;
        return authAxios.put<BaseResponse>(`/admin/fact/update/${id}`, rest)
    },
    create: (payload: IFactRequest) => {
        return authAxios.post<BaseResponse>('/admin/fact/create', payload);
    },
    delete: (payload: IDeleteRequest) => {
        return authAxios.delete<BaseResponse>(`/admin/fact/delete/${payload.id}`)
    },
    changeStatus: (payload: IChangeStatusRequest) => {
        const {id, enabled} = payload
        return authAxios.put<BaseResponse>(`/admin/fact/update-status/${id}`, {enabled: enabled})
    },
}

export default factApi