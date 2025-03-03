"use client"

import React, { useEffect } from "react"
import { useTranslations } from "next-intl"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectFoodCategory, getFoodCategory } from "@/redux/features/foodCategory/reducer"
import { ACTION_PATH, DETAIL_DATA_TYPE } from "@/utils/constants"
import { backMainPage } from "@/utils/helpers/common"
import { IDetailField } from "@/types/common"
import { FormActions, DetailContent, PageHeading } from "@/views/DynamicComponent/DynamicComponent"

const FoodCategoryDetail = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const item = useAppSelector(selectFoodCategory)
    const fields: IDetailField[] = [
        { key: "id", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: "name",
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "common.name",
        },
        {
            key: "brand.name",
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "brand.name",
        },
        {
            key: "thumbnail",
            type: DETAIL_DATA_TYPE.IMAGE,
            keyLabel: "common.thumbnail",
        },
        {
            key: "createdBy.name",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.createdBy",
        },
        {
            key: "updatedBy.name",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.updatedBy",
        },
        {
            key: `sort`,
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.sort",
        },
        {
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const fetchItem = async () => {
        await dispatch(getFoodCategory(id as string))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("foodCategory.view")} currentPathname={pathname} />
            <DetailContent data={item} fields={fields} />
            <FormActions
                backMainPage={() => backMainPage(pathname, ACTION_PATH.view, router)}
                viewOnly={true}
            />
        </div>
    )
}

export default FoodCategoryDetail
