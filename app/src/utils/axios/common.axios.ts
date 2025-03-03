import axios from "axios"
import { API } from '../constants'
import Swal from "sweetalert2"

const commonAxios = axios.create({
    baseURL: `${API}`,
})

export const removeLoading = () => {
    const loadingEle = document.getElementById('loading-indecator');
    if (loadingEle) {
      loadingEle.style.display = "none";
    }
}

commonAxios.interceptors.request.use(
    req => {
        const loadingEle = document.getElementById('loading-indecator');
        if (loadingEle) {
          loadingEle.style.display = "block";
        }
    
        switch ((req.method as string).toUpperCase()) {
            case "GET": {
                req.params = req.params || {}
                // Object.assign(req.params, {
                //     language: window.NextPublic.lang.toLowerCase(),
                // })
                break
            }
            case "POST": {
                // if (req.data instanceof FormData) {
                //     req.data.append("language", window.NextPublic.lang.toLowerCase())
                // } else {
                //     req.data = req.data || {}
                //     Object.assign(req.data, {
                //         language: window.NextPublic.lang.toLowerCase(),
                //     })
                // }
                break
            }
            case "PUT": {
                // if (req.data instanceof FormData) {
                //     req.data.append("language", window.NextPublic.lang.toLowerCase())
                // } else {
                //     req.data = req.data || {}
                //     Object.assign(req.data, {
                //         language: window.NextPublic.lang.toLowerCase(),
                //     })
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

commonAxios.interceptors.response.use(
    res => {
        removeLoading();
        return res
    },
    err => {
        removeLoading();
        Swal.fire('Error!', err?.response?.data?.message, 'error');
        return Promise.reject(err?.response ?? {})
    },
)

export default commonAxios
