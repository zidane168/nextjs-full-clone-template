"use client"

import React, { useEffect } from "react"
import { useTranslations } from "next-intl"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { ACTION_PATH, DETAIL_DATA_TYPE } from "@/utils/constants"
import { backMainPage } from "@/utils/helpers/common"
import { IDetailField } from "@/types/common"
import { getUserDetail, selectUserDetail } from "@/redux/features/user/reducer"
import { PageHeading, FormActions, DetailContent } from "@/views/DynamicComponent/DynamicComponent"
import { Grid } from "@mui/material"

const RoleDetail = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const item = useAppSelector(selectUserDetail)
    const fields: IDetailField[] = [
        { key: "id", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: "name",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.name",
        },
        {
            key: "phone",
            type: DETAIL_DATA_TYPE.PHONE,
            keyLabel: "common.phone",
        },
        {
            key: "email",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.email",
        },
        {
            key: "signUpFrom",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "user.signUpFrom",
        },
        {
            key: "createdBy.name",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.createdBy",
        },
        {
            key: "updatedBy.name",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.updatedBy",
        },
        {
            key: "createdAt",
            type: DETAIL_DATA_TYPE.DATETIME,
            keyLabel: "common.createdAt",
        },
        {
            key: "updatedAt",
            type: DETAIL_DATA_TYPE.DATETIME,
            keyLabel: "common.updatedAt",
        },
        {
            key: "isKitchen",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "user.isKitchen",
        },
        {
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const roleFields: IDetailField[] = [
        {
            key: "roles.0.role.id",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.id",
        },
        {
            key: "roles.0.role.title",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.title",
        },
        {
            key: "roles.0.role.description",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.description",
        },
        {
            key: "roles.0.role.updatedAt",
            type: DETAIL_DATA_TYPE.DATETIME,
            keyLabel: "common.updatedAt",
        },
        {
            key: "roles.0.role.enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const fetchItem = async () => {
        await dispatch(getUserDetail({ id: parseInt(id as string) }))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("user.view")} currentPathname={pathname} />
            <DetailContent data={item} fields={fields} />

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container spacing={2} sx={{ marginTop: "0px" }}>
                        <Grid item xs={12}>
                            <h4>{t("user.role")}</h4>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ marginTop: "0px" }}>
                        <Grid item xs={12}>
                            <DetailContent data={item} fields={roleFields} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <FormActions
                backMainPage={() => backMainPage(pathname, ACTION_PATH.view, router)}
                viewOnly={true}
            />
        </div>
    )
}

export default RoleDetail
