"use client"

import { getMember, selectMember } from "@/redux/features/member/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IDetailField } from "@/types/common"
import { ACTION_PATH, DETAIL_DATA_TYPE } from "@/utils/constants"
import { backMainPage } from "@/utils/helpers/common"
import { useTranslations } from "next-intl"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { FormActions, DetailContent, PageHeading } from "@/views/DynamicComponent/DynamicComponent"

const ViewMember = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const item = useAppSelector(selectMember)
    const fields: IDetailField[] = [
        { key: "id", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: "name",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "member.name",
        },
        {
            key: "email",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.email",
        },
        {
            key: "locale",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.locale",
        },
        {
            key: "phone",
            type: DETAIL_DATA_TYPE.PHONE,
            keyLabel: "common.phone",
        },
        {
            key: "dob",
            type: DETAIL_DATA_TYPE.DATE,
            keyLabel: "member.dob",
        },
        {
            key: "gender",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "member.gender",
        },
        {
            key: "createdAt",
            type: DETAIL_DATA_TYPE.DATETIME,
            keyLabel: "common.createdAt",
        },
        {
            key: "updatedAt",
            type: DETAIL_DATA_TYPE.DATETIME,
            keyLabel: "common.updatedAt",
        },
        {
            key: "createdBy",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.createdBy",
        },
        {
            key: "updatedBy",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.updatedBy",
        },
        {
            key: "isNotifiable",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "member.isNotifiable",
        },
        {
            key: "isEmailVerified",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "member.isEmailVerified",
        },
        {
            key: "isPhoneVerified",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "member.isPhoneVerified",
        },
        {
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const fetchItem = async () => {
        await dispatch(getMember(id as string))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("member.view")} currentPathname={pathname} />
            <DetailContent data={item} fields={fields} />
            <FormActions
                backMainPage={() => backMainPage(pathname, ACTION_PATH.view, router)}
                viewOnly={true}
            />
        </div>
    )
}

export default ViewMember
