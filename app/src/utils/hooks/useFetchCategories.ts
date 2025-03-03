import { selectAuthUser } from "@/redux/features/auth/reducer"
import { getBrands, selectBrands, selectIsLoadBrandList } from "@/redux/features/brand/reducer"
import {
    getProductCategories,
    selectIsLoadList,
    selectProductCategories,
} from "@/redux/features/productCategory/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IBrand } from "@/types/brand"
import { IFieldLanguage } from "@/types/common"
import { IProductCategory } from "@/types/productCategory"
import { useEffect } from "react"

export const useFetchCategories = (locale: string) => {
    const dispatch = useAppDispatch()
    const currentUser = useAppSelector(selectAuthUser)
    const isLoadedList = useAppSelector(selectIsLoadList)
    const listItems = useAppSelector(selectProductCategories)
    const listItemOptions = listItems.map((item: IProductCategory) => {
        return {
            label: item.name?.[locale as keyof IFieldLanguage] ?? "",
            value: item.id,
        }
    })
    useEffect(() => {
        let ignore = false
        const fetchCates = async () => {
            await dispatch(getProductCategories())
        }
        if (currentUser && !isLoadedList) {
            fetchCates()
        }
        return () => {
            ignore = true
        }
    }, [currentUser, isLoadedList])
    return {
        listItems,
        listItemOptions,
    }
}
