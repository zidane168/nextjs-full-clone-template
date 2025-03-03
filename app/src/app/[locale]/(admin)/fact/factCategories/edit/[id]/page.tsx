"use client"

import React, { useEffect } from "react"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import {
    getFactCategoryDetail,
    selectFactCategoryDetail,
} from "@/redux/features/factCategory/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { ACTION_PATH } from "@/utils/constants"
import FactCategoryForm from "../../form"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"

const EditFactCategory = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()

    const initialValue = useAppSelector(selectFactCategoryDetail)

    const fetchItem = async () => {
        await dispatch(getFactCategoryDetail({ id: id as unknown as number }))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("factCategory.edit")} currentPathname={pathname} />
            <FactCategoryForm
                id={String(id)}
                initialValue={initialValue}
                action={ACTION_PATH.edit}
            />
        </div>
    )
}
;``
export default EditFactCategory
