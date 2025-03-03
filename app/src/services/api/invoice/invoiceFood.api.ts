import { BaseResponse, IChangeStatusInvoiceRequest, IDetailRequest } from "@/types/common";
import { authAxios } from "@/utils/axios";

const invoiceFoodApi = {
    fetchFoodInvoices(payload: Record<string,string>){
        return authAxios.get<BaseResponse>('/admin/member-food-invoice/list', {params: payload})
    },
    fetchFoodInvoiceDetail: (payload: IDetailRequest) => {
        return authAxios.get<BaseResponse>(`/admin/member-food-invoice/get/${payload.id}`);
    },
    fetchFoodInvoiceStatus: () => {
        return authAxios.get<BaseResponse>(`/admin/member-food-invoice/list-status`)
    },
    changeStatus: (payload: IChangeStatusInvoiceRequest) => {
        const {id, status} = payload
        return authAxios.put<BaseResponse>(`/admin/member-food-invoice/update/${id}`, {status: status})
    },
    export: (payload?: Record<string, string>) => {
        return authAxios.get<BaseResponse>(`/admin/member-food-invoice/write`, { params: payload })
    },
}

export default invoiceFoodApi