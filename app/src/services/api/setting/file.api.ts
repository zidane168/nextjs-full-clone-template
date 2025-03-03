import { BaseResponse } from "@/types/common";
import authFileAxios from "@/utils/axios/authFile.axios";

const fileApi = {
    uploadFile: (payload: FormData) => {
        return authFileAxios.post<BaseResponse>('/admin/attachment/upload-file', payload);
    },
    uploadFiles: (payload: FormData) => {
        return authFileAxios.post<BaseResponse>('/admin/attachment/upload-files', payload);
    },
}

export default fileApi