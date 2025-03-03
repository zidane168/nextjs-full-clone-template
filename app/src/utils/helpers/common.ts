import { ILoginUser } from "@/types/user"
import dayjs from "dayjs"
import moment from "moment"

import { IFilterPagingClientSide, IListRequest, ISelectOption } from "@/types/common"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"
import { ReadonlyURLSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import { Dispatch } from "redux"
import Swal, { SweetAlertIcon } from "sweetalert2"
import { GENDER_OPTIONS, MENU_PATHNAMES, WEBSITE_LANGUAGES } from "../constants"
export const currencyFormat = (cash: any = 0) => {
    if (cash && cash % 1 === 0) {
        return cash.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }
    return cash.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

export const formatDateTimeServerToLocal = (value?: string) => {
    const momentValue = moment(value)
    if (momentValue.isValid()) {
        return momentValue.format("YYYY-MM-DD HH:ss")
    }
    return ""
}

export const formatDateServerToLocal = (value?: string) => {
    const momentValue = moment(value)
    if (momentValue.isValid()) {
        return momentValue.format("YYYY-MM-DD")
    }
    return ""
}

export const formatTimeServerToLocal = (value?: string) => {
    const momentValue = moment(value, "HH:mm")
    if (momentValue.isValid()) {
        return momentValue.format("HH:mm")
    }
    return value
}

export const formatGender = (value: string) => {
    const genderOption = GENDER_OPTIONS.find(option => option.value === value)
    return genderOption ? genderOption.label : ""
}

export const getPermissionActionByPathname = (pathName: string, user?: ILoginUser | null) => {
    let actions = [] as string[]
    WEBSITE_LANGUAGES.forEach(item => {
        if (pathName.indexOf(`/${item}`) === 0) {
            pathName = pathName.replace(`/${item}`, "")
        }
    })
    const subject = (Object.keys(MENU_PATHNAMES) as Array<string>).find(
        key => MENU_PATHNAMES[key] === pathName,
    )
    user?.permissions?.forEach(permission => {
        permission.subjects.forEach(sub => {
            if (sub.subject.toUpperCase() === subject?.toUpperCase()) {
                actions = sub.actions
                return
            }
        })
        if (actions.length > 0) {
            return
        }
    })
    return actions
}

export const redirectToLogout = () => {
    const pathname = window.location.pathname
    let locale = ""
    WEBSITE_LANGUAGES.forEach(item => {
        if (pathname.indexOf(`/${item}`) === 0) {
            locale = item
            return
        }
    })

    const searchParams = new URLSearchParams(window.location.search)
    const arrQueries = []
    for (const [key, value] of searchParams) {
        arrQueries.push(`${key}=${value}`)
    }
    const redirectUrl = encodeURIComponent(`${pathname}?${arrQueries.join("&")}`)
    window.location.href = `${locale !== "" ? `/${locale}` : ""}/logout?redirectUrl=${redirectUrl}`
}

export const pushNewRoute = (queryList: IListRequest) => {
    const hostOrigin = window.location.origin
    const pathname = window.location.pathname
    const params = [] as string[]
    for (const key in queryList.params) {
        if (queryList.params?.[key]) {
            params.push(`${key}=${queryList.params?.[key]}`)
        }
    }
    if (queryList.page && queryList.page !== 1) {
        params.push(`page=${queryList.page}`)
    }
    if (queryList.orderBy && queryList.orderBy !== "" && queryList.orderBy !== "id") {
        params.push(`orderBy=${queryList.orderBy}`)
    }
    if (queryList.orderDirection && queryList.orderDirection !== "asc") {
        params.push(`orderDirection=${queryList.orderDirection}`)
    }
    if (params.length > 0) {
        const nextURL = `${hostOrigin}${pathname}?${params.join("&")}`
        const nextState = { additionalInformation: nextURL }
        window.history.pushState(nextState, nextURL, nextURL)
    } else {
        const nextURL = `${hostOrigin}${pathname}`
        window.history.pushState({}, "", nextURL)
    }
}

export const createParams = (data: Record<string, any>) => {
    return Object.keys(data).reduce((result, key) => {
        if (data[key] !== "" && !(Array.isArray(data[key]) && data[key].length === 0)) {
            result[key] = typeof data[key] === "boolean" ? String(data[key]) : data[key]
        }
        return result
    }, {} as Record<string, any>)
}

export const formatDataSearch = (queryList: IListRequest) => {
    const searchParams = {} as Record<string, string>
    for (const key in queryList.params) {
        if (queryList.params?.[key] !== undefined && queryList.params?.[key] !== null) {
            searchParams[key] = queryList.params?.[key]
        }
    }
    if (queryList.page) {
        searchParams["page"] = String(queryList.page)
    }
    if (queryList.perPage) {
        searchParams["perPage"] = String(queryList.perPage)
    }
    if (queryList.orderBy) {
        searchParams["orderBy"] = queryList.orderBy
    }
    if (queryList.orderDirection) {
        searchParams["orderDirection"] = queryList.orderDirection
    }
    return searchParams
}

export const getQueryParams = (searchParams: ReadonlyURLSearchParams) => {
    const params = new URLSearchParams(searchParams.toString())
    const paramsObject = Object.fromEntries(params)
    const queryList = {} as IListRequest

    if (Object.keys(paramsObject).length !== 0) {
        const { page, orderBy, orderDirection, ...restParams } = paramsObject

        if (page) queryList.page = Number(page)
        if (orderBy) queryList.orderBy = orderBy
        if (orderDirection) queryList.orderDirection = orderDirection

        if (Object.keys(restParams).length !== 0) {
            queryList.params = restParams
        }
    }
    return queryList
}

export const filterPagingClientSide = (
    displayData: any[],
    queryList: IListRequest,
    locale: string,
): IFilterPagingClientSide => {
    const localeKeys = ["name", "title", "address"]
    const likeKeys = ["name", "title", "email"]

    //validate params' values
    for (const key in queryList.params) {
        if (typeof queryList.params[key] === "undefined" || !queryList.params[key]) {
            delete queryList.params[key]
        }
    }

    // filter
    for (const key in queryList.params) {
        if (localeKeys.includes(`${key}`) && displayData[0]?.[key]?.[locale]) {
            displayData = displayData.filter((item: any) => {
                return (
                    item?.[key] &&
                    item?.[key]?.[locale] &&
                    item[key][locale]
                        .toLowerCase()
                        .includes(queryList?.params?.[key]?.trim().toLowerCase() || "")
                )
            })
        } else if (likeKeys.includes(key)) {
            displayData = displayData.filter(
                (item: any) =>
                    item?.[key] &&
                    item[key]
                        .toLowerCase()
                        .includes(queryList?.params?.[key]?.trim().toLowerCase() || ""),
            )
        } else {
            displayData = displayData.filter((item: any) => {
                if (typeof item[key] === "boolean") {
                    return item[key].toString().toLowerCase() === queryList.params?.[key]
                } else if (item[key] && queryList.params?.[key]) {
                    return (
                        item[key].toString().toLowerCase() ===
                        queryList.params[key].toString().toLowerCase()
                    )
                }
                return false
            })
        }
    }

    const totalRecords = displayData.length
    // paging
    const skip = (queryList.page - 1) * queryList.perPage
    displayData = displayData.slice(skip, skip + queryList.perPage)
    return {
        data: displayData,
        totalRecords,
    }
}

export const backMainPage = (pathname: string, action: string, router: AppRouterInstance) => {
    const indexAction = pathname.indexOf(`/${action}`)
    if (indexAction > -1) {
        const redirectUrl = pathname.slice(0, indexAction)
        router.push(redirectUrl)
    }
}

export const getLocaleByUrl = () => {
    const pathname = window.location.pathname
    let locale = WEBSITE_LANGUAGES[0]
    WEBSITE_LANGUAGES.forEach(item => {
        if (pathname.indexOf(`/${item}`) === 0) {
            locale = item
            return
        }
    })
    return locale
}

export const getValue = (mainKey: string, item: any) => {
    const keys = mainKey.split(".")
    let tempValue = item
    keys.forEach((key: string) => {
        tempValue = tempValue?.[key]
        if (!tempValue) {
            return ""
        }
    })
    return Array.isArray(tempValue)
        ? tempValue
        : typeof tempValue === "object" && tempValue !== null
        ? ""
        : tempValue
}

export const getMonthOptions = (t: Function) => {
    const result = [] as ISelectOption[]
    for (var i = 1; i <= 12; i++) {
        result.push({
            label: t(`month.${String(i)}`),
            value: i,
        } as ISelectOption)
    }
    return result
}

export const getWeekdayOptions = (t: Function) => {
    const result = [] as ISelectOption[]
    for (var i = 0; i <= 6; i++) {
        result.push({
            label: t(`weekday.${String(i)}`),
            value: i,
        } as ISelectOption)
    }
    return result
}

export const showConfirmation = (
    title: string,
    confirmButtonText: string,
    confirmAction: Function,
    icon?: SweetAlertIcon,
) => {
    const locale = document.documentElement.lang
    Swal.fire({
        title: title,
        icon: icon ?? "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: locale === "tc" ? "取消" : "Cancel",
        confirmButtonText: confirmButtonText,
    }).then(result => {
        if (result.isConfirmed) {
            confirmAction()
        }
    })
}

export const dispatchAction = async (dispatch: Dispatch, action: any, successMessage: string) => {
    const value = await dispatch(action)
    if (!(value as any)?.error) {
        toast.success(successMessage)
    }
}

export const getFileType = (url: string) => {
    const extension = url?.split(".")?.pop()?.toLowerCase()
    switch (extension) {
        case "jpg":
        case "jpeg":
        case "png":
        case "webp":
            return "image"
        case "webm":
        case "ogg":
        case "mp4":
            return "video"
        default:
            return "unknown"
    }
}

export const imageLoader = ({ src, width }: { src: any; width: number }) => {
    return src + "?w=" + width
}

export const checkFormIsDirtyAndNavigateBack = (
    isDirty: Boolean,
    pathname: string,
    action: string,
    router: AppRouterInstance,
) => {
    if (!isDirty) {
        backMainPage(pathname, action, router)
        return true
    }
    return false
}

export async function getImageDimensions(file: File) {
    let img = new Image()
    img.src = URL.createObjectURL(file)
    await img.decode()
    let width = img.width
    let height = img.height
    return {
        width,
        height,
    }
}

export const extractMediasObjects = (data: Array<any>) => {
    return data.map(ele => {
        return {
            ...ele,
            initId: ele.id,
        }
    })
}
export const extractHolidayObjects = (data: Array<any>) => {
    return data.map(ele => {
        return {
            day: ele.day,
        }
    })
}   

export const transformDate = (data: string | Date, formatStyle = "YYYY-MM-DD") => {
    return dayjs(data).format(formatStyle)
}

export const dateToIsoString = (date: Date | string) => {
    return date ? new Date(date).toISOString().slice(0, 10) : undefined
}

export const formatDate = (date: any) => {
    return date ? dayjs(date).add(1, "day").toISOString().slice(0, 10) : undefined
}