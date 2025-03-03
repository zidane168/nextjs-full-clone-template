"use client"

import React from "react"
import BannerForm from "../form"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { ACTION_PATH } from "@/utils/constants"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"

const CreateBanner = () => {
    const t = useTranslations()
    const pathname = usePathname()

    return (
        <div>
            <PageHeading title={t("banner.create")} currentPathname={pathname} />
            <BannerForm action={ACTION_PATH.create} />
        </div>
    )
}

export default CreateBanner
