import { selectAuthUser } from "@/redux/features/auth/reducer"
import { getBrands, selectBrands, selectIsLoadBrandList } from "@/redux/features/brand/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IBrand } from "@/types/brand"
import { IFieldLanguage } from "@/types/common"
import { useEffect } from "react"
import { BRAND_ALWAYS_ACTIVE } from "../constants"

export const useFetchBrand = (locale: string) => {
    const dispatch = useAppDispatch()
    const currentUser = useAppSelector(selectAuthUser)
    const isLoadedList = useAppSelector(selectIsLoadBrandList)
    const listItems = useAppSelector(selectBrands)
    const listItemOptions = listItems.map((item: IBrand) => {
        return {
            label: item.name?.[locale as keyof IFieldLanguage] ?? "",
            value: item.id,
        }
    })
    const brandAlwaysActive = listItems
        .filter((item: IBrand) => {
            if (item.code === BRAND_ALWAYS_ACTIVE) {
                return {
                    label: item.name?.[locale as keyof IFieldLanguage] ?? "",
                    value: item.id,
                }
            }
        })
        .map((item: IBrand) => {
            return {
                label: item.name?.[locale as keyof IFieldLanguage] ?? "",
                value: item.id,
            }
        })

    useEffect(() => {
        let ignore = false
        const fetchBrands = async () => {
            await dispatch(getBrands())
        }
        if (currentUser && !isLoadedList) {
            fetchBrands()
        }
        return () => {
            ignore = true
        }
    }, [currentUser, isLoadedList])
    return {
        listItems,
        listItemOptions,
        brandAlwaysActive,
    }
}
