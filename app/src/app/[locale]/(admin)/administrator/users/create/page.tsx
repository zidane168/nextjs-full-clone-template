"use client"

import { Box } from "@mui/material"
import React from "react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { ACTION_PATH } from "@/utils/constants"
import UserForm from "../form"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"

const CreateUser = () => {
    const t = useTranslations()
    const pathname = usePathname()

    return (
        <>
            <PageHeading title={t("user.create")} currentPathname={pathname} />
            <Box>
                <UserForm action={ACTION_PATH.create} />
            </Box>
        </>
    )
}

export default CreateUser
