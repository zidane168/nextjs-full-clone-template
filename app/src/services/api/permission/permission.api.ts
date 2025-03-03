import authAxios from "@/utils/axios/auth.axios";
import { BaseResponse } from "@/types/common";

const roleApi = {
    fetchPermissions: () => {
        return authAxios.get<BaseResponse>('/admin/permission/list');
    },
}

export default roleApi