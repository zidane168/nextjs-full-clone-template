"use client"

import { getNewsDetail, selectNewsDetail } from "@/redux/features/news/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { INew } from "@/types/news"
import { ACTION_PATH } from "@/utils/constants"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import { useEffect } from "react"
import Form from "../../form"

const EditNew = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()

    const initValue = useAppSelector(selectNewsDetail)

    const fetchItem = async () => {
        await dispatch(getNewsDetail({ id: Number(id) }))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("new.edit")} currentPathname={pathname} />
            <Form
                initialValue={{ ...initValue } as INew}
                action={ACTION_PATH.edit}
                id={id as string}
            />
        </div>
    )
}

export default EditNew
