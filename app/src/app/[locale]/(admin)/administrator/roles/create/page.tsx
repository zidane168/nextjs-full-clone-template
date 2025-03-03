"use client"

import { Box } from "@mui/material"
import { IRole } from "@/types/role"
import React, { useEffect } from "react"
import { usePathname } from "next/navigation"
import RoleForm from "../form"
import PageHeading from "@/components/PageHeading"
import { useTranslations } from "next-intl"
import { ACTION_PATH } from "@/utils/constants"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { getPermissions, selectIsLoadList } from "@/redux/features/permission/reducer"

export default function CreateRole() {
    const t = useTranslations()
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const isLoadedList = useAppSelector(selectIsLoadList)

    const initialValue = {
        id: 0,
        title: "",
        description: "",
        permissions: [],
        updatedAt: "",
        createdAt: "",
    } as unknown as IRole

    useEffect(() => {
        if (!isLoadedList) dispatch(getPermissions())
    }, [isLoadedList])

    return (
        <>
            <PageHeading title={t("role.create")} currentPathname={pathname} />
            <Box>
                <RoleForm onEdit={false} initialValue={initialValue} action={ACTION_PATH.create} />
            </Box>
        </>
    )
}
