import { ILoginUser } from "@/types/user"
import { AUTH_TOKEN_KEY, AUTH_TOKEN_REFRESH_KEY, USER_PROFILE_KEY } from "@/utils/constants"

export const getToken = () => {
  if (typeof window === "undefined") return
  return JSON.parse(localStorage.getItem(AUTH_TOKEN_KEY) as any)
}

export const saveToken = (token: string) => {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token))
}

export const destroyToken = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export const saveUserProfile = (user: Partial<ILoginUser> | null) => {
  if (typeof window === "undefined") return
  return localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user))
}

export const getUserProfile = (): ILoginUser | null => {
  if (typeof window === "undefined") return null
  try {
    return JSON.parse(localStorage.getItem(USER_PROFILE_KEY) as any)
  } catch {
    return null
  }
}

export const destroyUserProfile = () => {
  localStorage.removeItem(USER_PROFILE_KEY)
}

export const saveRefreshToken = (refreshToken: string) => {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTH_TOKEN_REFRESH_KEY, JSON.stringify(refreshToken))
}

export const getRefreshToken = () => {
  if (typeof window === "undefined") return
  return JSON.parse(localStorage.getItem(AUTH_TOKEN_REFRESH_KEY) as any)
}

export const destroyRefreshToken = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_TOKEN_REFRESH_KEY)
}