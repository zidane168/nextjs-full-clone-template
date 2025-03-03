import axios from "axios"
import { jwtService } from "../../services"
import { API } from "../constants"
import { checkRequestInvalidToken, checkRequestInvalidValidation } from "../helpers/axios"
import Swal from "sweetalert2"
import { refreshAxios } from "."
import { BaseResponse, IErrorResponse } from "@/types/common"
import { removeLoading } from "./common.axios"
import { getLocaleByUrl } from "../helpers/common"

const authAxios = axios.create({
    baseURL: `${API}`,
    paramsSerializer: { indexes: null },
})

authAxios.interceptors.request.use(
    req => {
        const loadingEle = document.getElementById("loading-indecator")
        if (loadingEle) {
            loadingEle.style.display = "block"
        }

        const token = jwtService.getToken() || undefined
        const locale = getLocaleByUrl()
        req.headers!["Authorization"] = `bearer ${token}`
        req.headers!["x-custom-lang"] = locale

        switch ((req.method as string).toUpperCase()) {
            case "GET": {
                req.params = req.params || {}
                // Object.assign(req.params, {
                //   language: window.NextPublic.lang.toLowerCase(),
                // })
                break
            }
            case "POST": {
                // if (req.data instanceof FormData) {
                //   req.data.append("language", window.NextPublic.lang.toLowerCase())
                // } else {
                //   req.data = req.data || {}
                //   Object.assign(req.data, {
                //     language: window.NextPublic.lang.toLowerCase(),
                //   })
                // }
                break
            }
            case "PUT": {
                // if (req.data instanceof FormData) {
                //   req.data.append("language", window.NextPublic.lang.toLowerCase())
                // } else {
                //   req.data = req.data || {}
                //   Object.assign(req.data, {
                //     language: window.NextPublic.lang.toLowerCase(),
                //   })
                // }
                break
            }
        }
        return req
    },
    err => {
        return Promise.reject(err)
    },
)

authAxios.interceptors.response.use(
    res => {
        removeLoading()
        return res
    },
    async err => {
        if (checkRequestInvalidToken(err?.response?.data)) {
            const { data } = await refreshAxios.post<BaseResponse>("/admin/user/refresh")
            if (data?.data?.accessToken) {
                jwtService.saveToken(data?.data?.accessToken ?? "")

                const originalRequest = err.config
                originalRequest._retry = true
                axios.defaults.headers.common["Authorization"] = `Bearer ${data?.data?.accessToken}`
                return authAxios(originalRequest)
            }
        } else if (checkRequestInvalidValidation(err?.response?.data)) {
            const errors = err?.response?.data?.errors
            if (errors && errors.length > 0) {
                let errorMessage = ""
                errors.forEach((error: IErrorResponse) => {
                    let capitalizedMessage =
                        error.message.charAt(0).toUpperCase() + error.message.slice(1)
                    errorMessage += capitalizedMessage + "\n"
                })
                Swal.fire("Validation Error!!!", errorMessage, "error")
            }
        } else {
            Swal.fire(
                "Error!!!",
                err?.response?.data?.message ?? "Server or Internet is Down. Please try again.",
                "error",
            )
        }
        removeLoading()
        return Promise.reject(err)
    },
)

export default authAxios
