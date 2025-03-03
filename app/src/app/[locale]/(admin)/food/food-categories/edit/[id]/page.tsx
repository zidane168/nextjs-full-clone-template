"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { ACTION_PATH } from "@/utils/constants"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import { useEffect } from "react"
import Form from "../../form"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"
import { getProductCategory, selectProductCategory } from "@/redux/features/productCategory/reducer"
import { getFoodCategory, selectFoodCategory } from "@/redux/features/foodCategory/reducer"

const EditDistrict = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()

    const initValue = useAppSelector(selectFoodCategory)

    const fetchItem = async () => {
        await dispatch(getFoodCategory(id as string))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("productCategory.edit")} currentPathname={pathname} />
            <Form initialValue={initValue} action={ACTION_PATH.edit} id={id as string} />
        </div>
    )
}

export default EditDistrict
