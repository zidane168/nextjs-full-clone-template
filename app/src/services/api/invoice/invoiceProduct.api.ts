import { BaseResponse, IChangeStatusInvoiceRequest, IDetailRequest } from "@/types/common";
import { authAxios } from "@/utils/axios";

const invoiceProductApi = {
    fetchProductInvoices(payload: Record<string,string>){
        return authAxios.get<BaseResponse>('/admin/member-product-invoice/list', {params: payload})
    },
    fetchProductInvoiceDetail: (payload: IDetailRequest) => {
        return authAxios.get<BaseResponse>(`/admin/member-product-invoice/get/${payload.id}`);
    },
    fetchProductInvoiceStatus: () => {
        return authAxios.get<BaseResponse>(`/admin/member-product-invoice/list-status`)
    },
    changeStatus: (payload: IChangeStatusInvoiceRequest) => {
        const {id, status} = payload
        return authAxios.put<BaseResponse>(`/admin/member-product-invoice/update/${id}`, {status: status})
    },
}

export default invoiceProductApi