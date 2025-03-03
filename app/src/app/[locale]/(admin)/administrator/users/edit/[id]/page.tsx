"use client"

import React, { useEffect } from "react"
import UserForm from "../../form"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { Box } from "@mui/material"
import { getUserDetail, selectUserDetailFormat } from "@/redux/features/user/reducer"
import { ACTION_PATH } from "@/utils/constants"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"

const EditUser = () => {
    const { id } = useParams()
    const t = useTranslations()
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const initialValue = useAppSelector(selectUserDetailFormat)

    const fetchUserDetail = async () => {
        dispatch(getUserDetail({ id: parseInt(id as string) }))
    }

    useEffect(() => {
        fetchUserDetail()
    }, [])

    return (
        <>
            <PageHeading title={t("user.edit")} currentPathname={pathname} />
            <Box>
                {initialValue && (
                    <UserForm
                        action={ACTION_PATH.edit}
                        initialValue={initialValue}
                        id={id as string}
                    />
                )}
            </Box>
        </>
    )
}

export default EditUser
