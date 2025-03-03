"use client"

import { Box } from "@mui/material"
import React, { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { ACTION_PATH } from "@/utils/constants"
import MemberForm from "../form"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { getDistricts, selectIsLoadDistrictList } from "@/redux/features/district/reducer"

const CreateUser = () => {
    const t = useTranslations()
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const isLoadDistrictList = useAppSelector(selectIsLoadDistrictList)
    const fetchDistricts = async () => {
        await dispatch(getDistricts())
    }

    useEffect(() => {
        if (!isLoadDistrictList) fetchDistricts()
    }, [isLoadDistrictList])

    return (
        <>
            <PageHeading title={t("member.create")} currentPathname={pathname} />
            <Box>
                <MemberForm action={ACTION_PATH.create} />
            </Box>
        </>
    )
}

export default CreateUser
