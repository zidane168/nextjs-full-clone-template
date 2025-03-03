"use client"

import { getCompanyDetail, selectCompanyDetail } from "@/redux/features/company/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IDetailField } from "@/types/common"
import { ACTION_PATH, DETAIL_DATA_TYPE } from "@/utils/constants"
import { backMainPage } from "@/utils/helpers/common"
import { DetailContent, FormActions, PageHeading } from "@/views/DynamicComponent/DynamicComponent"
import { useTranslations } from "next-intl"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const CompanyDetail = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const item = useAppSelector(selectCompanyDetail)
    const fields: IDetailField[] = [
        { key: "id", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: "name",
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "common.name",
        },
        {
            key: "content",
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "common.content",
        },
        {
            key: "createdBy.name",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.createdBy",
        },
        {
            key: "coverImage",
            type: DETAIL_DATA_TYPE.IMAGE,
            keyLabel: "common.coverImage",
        },
        {
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const fetchItem = async () => {
        await dispatch(getCompanyDetail({ id: id as string }))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("company.view")} currentPathname={pathname} />
            <DetailContent data={item} fields={fields} />
            <FormActions
                backMainPage={() => backMainPage(pathname, ACTION_PATH.view, router)}
                viewOnly={true}
            />
        </div>
    )
}

export default CompanyDetail
