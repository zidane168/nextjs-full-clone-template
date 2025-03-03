"use client"

import React, { useEffect } from "react"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import { getBannerDetail, selectBannerDetail } from "@/redux/features/banner/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { ACTION_PATH } from "@/utils/constants"
import BannerForm from "../../form"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"

const EditBanner = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()

    const initialValue = useAppSelector(selectBannerDetail)

    const fetchItem = async () => {
        await dispatch(getBannerDetail({ id: id as unknown as number }))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("banner.edit")} currentPathname={pathname} />
            <BannerForm id={String(id)} initialValue={initialValue} action={ACTION_PATH.edit} />
        </div>
    )
}

export default EditBanner
