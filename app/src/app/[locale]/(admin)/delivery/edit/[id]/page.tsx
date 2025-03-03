"use client"

import { getDeliveryDetail, selectDeliveryDetail } from "@/redux/features/delivery/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IDeliveryFormdata } from "@/types/delivery"
import { ACTION_PATH } from "@/utils/constants"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import { useEffect } from "react"
import Form from "../../form"

const EditDelivery = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()

    const initValue = useAppSelector(selectDeliveryDetail)
    const fetchItem = async () => {
        await dispatch(getDeliveryDetail({ id: Number(id) }))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("delivery.edit")} currentPathname={pathname} />
            <Form
                initialValue={{ ...initValue } as IDeliveryFormdata}
                action={ACTION_PATH.edit}
                id={id as string}
            />
        </div>
    )
}

export default EditDelivery
