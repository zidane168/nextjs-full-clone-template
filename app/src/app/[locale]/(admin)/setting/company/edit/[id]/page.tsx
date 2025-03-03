"use client"

import { getCompanyDetail, selectCompanyDetail } from "@/redux/features/company/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { ICompany } from "@/types/company"
import { ACTION_PATH } from "@/utils/constants"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import { useEffect } from "react"
import Form from "../../form"

const EditCompany = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()

    const initValue = useAppSelector(selectCompanyDetail)

    const fetchItem = async () => {
        await dispatch(getCompanyDetail({ id: Number(id) }))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("company.edit")} currentPathname={pathname} />
            <Form
                initialValue={{ ...initValue } as ICompany}
                action={ACTION_PATH.edit}
                id={id as string}
            />
        </div>
    )
}

export default EditCompany
