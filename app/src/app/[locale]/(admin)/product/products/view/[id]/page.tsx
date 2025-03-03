"use client"

import { getProduct, selectProduct } from "@/redux/features/product/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IDetailField } from "@/types/common"
import { ACTION_PATH, DETAIL_DATA_TYPE, mediaHeadings } from "@/utils/constants"
import { backMainPage } from "@/utils/helpers/common"
import {
    DataTable,
    DetailContent,
    FormActions,
    PageHeading,
} from "@/views/DynamicComponent/DynamicComponent"
import { Grid } from "@mui/material"
import { useTranslations } from "next-intl"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const ViewProduct = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    // const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()

    const item = useAppSelector(selectProduct)
    const fields: IDetailField[] = [
        { key: "id", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: "name",
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "common.name",
        },
        {
            key: "content",
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "common.content",
        },
        {
            key: "thumbnail",
            type: DETAIL_DATA_TYPE.IMAGE,
            keyLabel: "common.thumbnail",
        },
        {
            key: "coverImage",
            type: DETAIL_DATA_TYPE.IMAGE,
            keyLabel: "common.coverImage",
        },
        {
            key: "published",
            type: DETAIL_DATA_TYPE.DATE,
            keyLabel: "common.published",
        },
        {
            key: "unpublished",
            type: DETAIL_DATA_TYPE.DATE,
            keyLabel: "common.unpublished",
        },
        {
            key: "price",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.price",
        },
        {
            key: "discount",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "product.discount",
        },
        {
            key: "discountPercent",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "product.discount",
        },
        {
            key: "popular",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "product.popular",
        },
        {
            key: "bestSeller",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.bestSeller",
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
            key: "sort",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.sort",
        },
        {
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const categoryFields: IDetailField[] = [
        { key: "id", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: "name",
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "common.name",
        },
        {
            key: "thumbnail",
            type: DETAIL_DATA_TYPE.IMAGE,
            keyLabel: "common.thumbnail",
        },
        {
            key: "createdBy",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.createdBy",
        },
        {
            key: "updatedBy",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.updatedBy",
        },
        {
            key: "sort",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.sort",
        },
        {
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const fetchItem = async () => {
        await dispatch(getProduct(id as string))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("product.view")} currentPathname={pathname} />
            <DetailContent data={item} fields={fields} />
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container spacing={2} sx={{ marginTop: "0px" }}>
                        <Grid item xs={12}>
                            <h4>{t("common.category")}</h4>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ marginTop: "0px", marginBottom: "10px" }}>
                        <Grid item xs={12}>
                            <DetailContent data={item.category} fields={categoryFields} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {item.medias && item.medias.length > 0 && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2} sx={{ marginTop: "0px" }}>
                            <Grid item xs={12}>
                                <h4>{t("product.medias")}</h4>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ marginTop: "0px", marginBottom: "10px" }}>
                            <Grid item xs={12}>
                                <DataTable
                                    headings={mediaHeadings}
                                    data={item.medias}
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

export default ViewProduct
