"use client"

import { getStoreDetail, selectStoreDetail } from "@/redux/features/store/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IStore } from "@/types/store"
import { ACTION_PATH } from "@/utils/constants"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import { useEffect } from "react"
import Form from "../../form"

const EditStore = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()

    const initValue = useAppSelector(selectStoreDetail)

    const fetchItem = async () => {
        await dispatch(getStoreDetail({ id: Number(id) }))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("store.edit")} currentPathname={pathname} />
            <Form
                initialValue={{ ...initValue } as IStore}
                action={ACTION_PATH.edit}
                id={id as string}
            />
        </div>
    )
}

export default EditStore
