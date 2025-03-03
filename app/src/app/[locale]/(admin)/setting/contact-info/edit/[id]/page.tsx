"use client"

import { getContactInfo, selectContactInfo } from "@/redux/features/contactInfo/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IContactInfo } from "@/types/contactInfo"
import { ACTION_PATH } from "@/utils/constants"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import { useEffect } from "react"
import Form from "../../form"

const EditContactInfo = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()

    const initValue = useAppSelector(selectContactInfo)

    const fetchItem = async () => {
        await dispatch(getContactInfo(Number(id)))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("contactInfo.edit")} currentPathname={pathname} />
            <Form
                initialValue={{ ...initValue } as IContactInfo}
                action={ACTION_PATH.edit}
                id={id as string}
            />
        </div>
    )
}

export default EditContactInfo
