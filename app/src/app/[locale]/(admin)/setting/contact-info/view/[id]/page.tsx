"use client"

import { getContactInfo, selectContactInfo } from "@/redux/features/contactInfo/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IDetailField } from "@/types/common"
import { ACTION_PATH, DETAIL_DATA_TYPE } from "@/utils/constants"
import { backMainPage } from "@/utils/helpers/common"
import { DetailContent, FormActions, PageHeading } from "@/views/DynamicComponent/DynamicComponent"
import { useTranslations } from "next-intl"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const ContactInfoDetail = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const item = useAppSelector(selectContactInfo)
    const fields: IDetailField[] = [
        { key: "id", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: `name`,
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "common.name",
        },
        {
            key: `content`,
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "common.content",
        },
        {
            key: "phone",
            type: DETAIL_DATA_TYPE.PHONE,
            keyLabel: "common.phone",
        },
        {
            key: "fax",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "contactInfo.fax",
        },
        {
            key: "whatsapp",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "contactInfo.whatsapp",
        },
        {
            key: "email",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.email",
        },
        {
            key: "coverImage",
            type: DETAIL_DATA_TYPE.IMAGE,
            keyLabel: "common.coverImage",
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
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const fetchItem = async () => {
        await dispatch(getContactInfo(id as unknown as number))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("contactInfo.view")} currentPathname={pathname} />
            <DetailContent data={item} fields={fields} />
            <FormActions
                backMainPage={() => backMainPage(pathname, ACTION_PATH.view, router)}
                viewOnly={true}
            />
        </div>
    )
}

export default ContactInfoDetail
