"use client"

import { Box } from "@mui/material"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import React, { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { getRoleDetail, selectRoleDetail } from "@/redux/features/role/reducer"
import RoleForm from "../../form"
import { ACTION_PATH } from "@/utils/constants"
import { useTranslations } from "next-intl"
import PageHeading from "@/components/PageHeading"
import { getPermissions, selectIsLoadList } from "@/redux/features/permission/reducer"

export default function EditRole() {
    const { id } = useParams()
    const t = useTranslations()
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const isLoadedList = useAppSelector(selectIsLoadList)

    const initialValue = useAppSelector(selectRoleDetail)

    const fetchData = async () => {
        await dispatch(getRoleDetail({ id: id as unknown as number }))
    }

    const fetchPermissions = async () => {
        await dispatch(getPermissions())
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (!isLoadedList) fetchPermissions()
    }, [isLoadedList])

    return (
        <>
            <PageHeading title={t("role.edit")} currentPathname={pathname} />
            <Box>
                {initialValue && (
                    <RoleForm
                        onEdit={true}
                        action={ACTION_PATH.edit}
                        initialValue={initialValue}
                        id={id as string}
                    />
                )}
            </Box>
        </>
    )
}
