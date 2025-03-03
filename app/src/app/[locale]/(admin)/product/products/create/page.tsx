"use client"

import { ACTION_PATH } from "@/utils/constants"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import Form from "../form"

import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"

const CreateProduct = () => {
    const t = useTranslations()
    const pathname = usePathname()

    return (
        <div>
            <PageHeading title={t("product.create")} currentPathname={pathname} />
            <Form action={ACTION_PATH.create} />
        </div>
    )
}

export default CreateProduct
