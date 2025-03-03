"use client"

import React from "react"
import FactCategoryForm from "../form"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { ACTION_PATH } from "@/utils/constants"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"

const CreateFactCategory = () => {
    const t = useTranslations()
    const pathname = usePathname()

    return (
        <div>
            <PageHeading title={t("factCategory.create")} currentPathname={pathname} />
            <FactCategoryForm action={ACTION_PATH.create} />
        </div>
    )
}

export default CreateFactCategory
