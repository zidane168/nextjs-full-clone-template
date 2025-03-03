import { BaseResponse } from "@/types/common"
import { authAxios } from "@/utils/axios"

const countryApi = {
    fetchList(){
        return authAxios.get<BaseResponse>('/admin/country/list')
    }
}

export default countryApi