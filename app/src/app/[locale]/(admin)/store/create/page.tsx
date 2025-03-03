"use client"

import React from "react"
import Form from "../form"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { ACTION_PATH } from "@/utils/constants"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"

const CreateDelivery = () => {
    const t = useTranslations()
    const pathname = usePathname()

    return (
        <div>
            <PageHeading title={t("store.create")} currentPathname={pathname} />
            <Form action={ACTION_PATH.create} />
        </div>
    )
}

export default CreateDelivery
