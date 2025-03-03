"use client"

import { IFactRequest } from "@/types/fact"
import { ACTION_PATH } from "@/utils/constants"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import Form from "../form"

const CreateFact = () => {
    const t = useTranslations()
    const pathname = usePathname()
    const initValue = {}

    return (
        <div>
            <PageHeading title={t("fact.create")} currentPathname={pathname} />
            <Form initValue={initValue as IFactRequest} action={ACTION_PATH.create} />
        </div>
    )
}

export default CreateFact
