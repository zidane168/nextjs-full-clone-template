import { selectAuthUser } from "@/redux/features/auth/reducer"
import { selectIsLoadFoodCategoryList } from "@/redux/features/foodCategory/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IFieldLanguage } from "@/types/common"
import { IFoodCategory } from "@/types/food-category"
import { useEffect } from "react"
import {
    getFoodCategories,
    selectFoodCategories,
} from "./../../redux/features/foodCategory/reducer"

export const useFetchFoodCategory = (locale: string) => {
    const dispatch = useAppDispatch()
    const currentUser = useAppSelector(selectAuthUser)
    const isLoadedList = useAppSelector(selectIsLoadFoodCategoryList)
    const listItems = useAppSelector(selectFoodCategories)

    const listItemOptions = listItems.map((item: IFoodCategory) => {
        return {
            label: item.name?.[locale as keyof IFieldLanguage] ?? "",
            value: item.id,
            belongToBrand: item?.brand.id,
        }
    })
    useEffect(() => {
        let ignore = false
        const fetchList = async () => {
            await dispatch(getFoodCategories())
        }
        if (currentUser && !isLoadedList) {
            fetchList()
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
