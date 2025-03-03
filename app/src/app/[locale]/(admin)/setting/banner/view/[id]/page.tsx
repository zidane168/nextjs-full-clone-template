"use client"

import React, { useEffect } from "react"
import { useTranslations } from "next-intl"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectBannerDetail, getBannerDetail } from "@/redux/features/banner/reducer"
import { ACTION_PATH, DETAIL_DATA_TYPE } from "@/utils/constants"
import { backMainPage } from "@/utils/helpers/common"
import { IDetailField } from "@/types/common"
import { FormActions, DetailContent, PageHeading } from "@/views/DynamicComponent/DynamicComponent"

const BannerDetail = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const item = useAppSelector(selectBannerDetail)
    const fields: IDetailField[] = [
        { key: "id", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: "url",
            type: DETAIL_DATA_TYPE.IMAGE,
            keyLabel: "common.url",
        },
        {
            key: `title`,
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "common.name",
        },
        {
            key: `brief`,
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "banner.brief",
        },
        {
            key: `type`,
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.type",
        },
        {
            key: "module",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "banner.module",
        },
        {
            key: "sort",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.sort",
        },
        {
            key: "updatedBy.name",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.updatedBy",
        },
        {
            key: "createdBy.name",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.createdBy",
        },
        {
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const fetchItem = async () => {
        await dispatch(getBannerDetail({ id: id as unknown as number }))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("banner.view")} currentPathname={pathname} />
            <DetailContent data={item} fields={fields} />
            <FormActions
                backMainPage={() => backMainPage(pathname, ACTION_PATH.view, router)}
                viewOnly={true}
            />
        </div>
    )
}

export default BannerDetail
