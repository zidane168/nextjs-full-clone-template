"use client"

import React, { useEffect } from "react"
import { useTranslations } from "next-intl"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectRoleDetail, getRoleDetail } from "@/redux/features/role/reducer"
import { ACTION_PATH, DETAIL_DATA_TYPE } from "@/utils/constants"
import { backMainPage } from "@/utils/helpers/common"
import { IDetailField } from "@/types/common"
import { PageHeading, FormActions, DetailContent } from "@/views/DynamicComponent/DynamicComponent"

const RoleDetail = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const item = useAppSelector(selectRoleDetail)
    const fields: IDetailField[] = [
        { key: "id", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: "title",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.title",
        },
        {
            key: "description",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.description",
        },
        {
            key: "updatedAt",
            type: DETAIL_DATA_TYPE.DATETIME,
            keyLabel: "common.updatedAt",
        },
        {
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const fetchItem = async () => {
        await dispatch(getRoleDetail({ id: id as unknown as number }))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("role.view")} currentPathname={pathname} />
            <DetailContent data={item} fields={fields} />
            <FormActions
                backMainPage={() => backMainPage(pathname, ACTION_PATH.view, router)}
                viewOnly={true}
            />
        </div>
    )
}

export default RoleDetail
