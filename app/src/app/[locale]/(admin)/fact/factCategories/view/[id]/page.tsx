"use client"

import React, { useEffect } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    selectFactCategoryDetail,
    getFactCategoryDetail,
} from "@/redux/features/factCategory/reducer"
import { ACTION_PATH, DETAIL_DATA_TYPE, TABLE_CELL_DATA_TYPE } from "@/utils/constants"
import { backMainPage } from "@/utils/helpers/common"
import { IDetailField, IHeading } from "@/types/common"
import { Grid } from "@mui/material"
import {
    PageHeading,
    FormActions,
    DetailContent,
    DataTable,
} from "@/views/DynamicComponent/DynamicComponent"

const FactCategoryDetail = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()

    const item = useAppSelector(selectFactCategoryDetail)
    const fields: IDetailField[] = [
        { key: "id", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: `name`,
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "common.name",
        },
        {
            key: `factType`,
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "factCategory.factType",
        },
        {
            key: "updatedBy.name",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.updatedBy",
        },
        {
            key: "createdBy.name",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.createdBy",
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
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const factHeadings: IHeading[] = [
        { key: "id", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        { key: "thumbnail", type: TABLE_CELL_DATA_TYPE.IMAGE, keyLabel: "common.thumbnail" },
        { key: "type", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.type" },
        { key: `name.${locale}`, type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.name" },
        { key: `content.${locale}`, type: TABLE_CELL_DATA_TYPE.HTML, keyLabel: "common.content" },
        { key: `enabled`, type: TABLE_CELL_DATA_TYPE.BOOLEAN, keyLabel: "common.enabled" },
    ]

    const fetchItem = async () => {
        await dispatch(getFactCategoryDetail({ id: id as unknown as number }))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("factCategory.view")} currentPathname={pathname} />
            <DetailContent data={item} fields={fields} />
            {item.facts && item.facts.length > 0 && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2} sx={{ marginTop: "0px" }}>
                            <Grid item xs={12}>
                                <h4>{t("factCategory.facts")}</h4>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ marginTop: "0px", marginBottom: "10px" }}>
                            <Grid item xs={12}>
                                <DataTable
                                    locale={locale}
                                    headings={factHeadings}
                                    data={item.facts}
                                    onlyView={true}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
            <FormActions
                backMainPage={() => backMainPage(pathname, ACTION_PATH.view, router)}
                viewOnly={true}
            />
        </div>
    )
}

export default FactCategoryDetail
