import { commonAxios } from "@/utils/axios"
import authAxios from "@/utils/axios/auth.axios"
import { BaseResponse, ILoginRequest } from "@/types/common"

const authApi = {
    signIn: (payload: ILoginRequest) => {
        return commonAxios.post<BaseResponse>("/admin/user/login", { ...payload })
    },
    fetchUser: () => {
        return authAxios.get<BaseResponse>("/admin/user/profile")
    },
    fetchMasterData: () => {
        return authAxios.get<BaseResponse>("/admin/setting/enums")
    },
}

export default authApi
