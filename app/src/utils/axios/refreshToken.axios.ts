import axios from "axios"
import { jwtService } from "../../services"
import { API } from '../constants'
import { checkRequestInvalidToken } from "../helpers/axios"
import Swal from "sweetalert2"
import { removeLoading } from "./common.axios"
import { redirectToLogout } from "../helpers/common"

const refreshAxios = axios.create({
  baseURL: `${API}`,
})

refreshAxios.interceptors.request.use(
  req => {
    const loadingEle = document.getElementById('loading-indecator');
    if (loadingEle) {
      loadingEle.style.display = "block";
    }

    const refreshToken = jwtService.getRefreshToken() || undefined

    req.headers!["Authorization"] = `bearer ${refreshToken}`

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

refreshAxios.interceptors.response.use(
  res => {
    removeLoading();
    return res
  },
  err => {
    if (checkRequestInvalidToken(err?.response?.data)) {
      redirectToLogout();
    } else {
      Swal.fire('Error!', err?.response?.data?.message, 'error');
    }
    removeLoading();
    return Promise.reject(err)
  },
)

export default refreshAxios
