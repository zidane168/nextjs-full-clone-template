"use client"

import DataTable from "@/components/DataTable/DataTable"
import { getFood, selectFood } from "@/redux/features/food/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IDetailField, IHeading } from "@/types/common"
import { IExtra } from "@/types/food"
import { ACTION_PATH, DETAIL_DATA_TYPE, TABLE_CELL_DATA_TYPE } from "@/utils/constants"
import { backMainPage } from "@/utils/helpers/common"
import { DetailContent, FormActions, PageHeading } from "@/views/DynamicComponent/DynamicComponent"
import { Box, Grid } from "@mui/material"
import { useLocale, useTranslations } from "next-intl"
import { useParams, usePathname, useRouter } from "next/navigation"
import { Fragment, useEffect } from "react"

const FoodDetail = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()
    const locale = useLocale()

    const item = useAppSelector(selectFood)
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
            key: "category.name",
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "food.category.name",
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
            keyLabel: "common.discount",
        },
        {
            key: "sort",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.sort",
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
            key: "popular",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "food.popular",
        },
        {
            key: "bestSeller",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.bestSeller",
        },
        {
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const mediaHeadings: IHeading[] = [
        { key: "id", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        { key: "url", type: TABLE_CELL_DATA_TYPE.IMAGE, keyLabel: "common.url" },
    ]

    const extraHeadings: IHeading[] = [
        { key: "id", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        { key: `name.${locale}`, type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.name" },
        { key: `limit`, type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "food.extras.limit" },
        { key: `sort`, type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.sort" },
        { key: `reqOpt`, type: TABLE_CELL_DATA_TYPE.BOOLEAN, keyLabel: "food.extras.reqOpt" },
        { key: `details`, type: TABLE_CELL_DATA_TYPE.TABLE, keyLabel: "food.extras.details.title" },
    ]

    const detailHeadings: IHeading[] = [
        { key: "id", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        { key: `name.${locale}`, type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.name" },
        { key: `price`, type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.price" },
        { key: `sort`, type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.sort" },
    ]

    const fetchItem = async () => {
        await dispatch(getFood(id as string))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("food.view")} currentPathname={pathname} />
            <DetailContent data={item} fields={fields} />
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
            {item.extras && item.extras.length > 0 && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2} sx={{ marginTop: "0px" }}>
                            <Grid item xs={12}>
                                <h4>{t("food.extras.title")}</h4>
                            </Grid>
                        </Grid>
                        <Grid container item spacing={2}>
                            {item.extras.map((extra: IExtra, extraIndex: number) => (
                                <Fragment key={extraIndex}>
                                    <Grid item xs={1} textAlign="end">
                                        <p>{extraIndex + 1}. </p>
                                    </Grid>
                                    <Grid item xs={11}>
                                        <DataTable
                                            locale={locale}
                                            headings={extraHeadings}
                                            subHeadings={detailHeadings}
                                            data={[extra]}
                                            subData={extra.details}
                                            onlyView={true}
                                        />
                                    </Grid>
                                </Fragment>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            )}
            <Box mt={2}>
                <FormActions
                    backMainPage={() => backMainPage(pathname, ACTION_PATH.view, router)}
                    viewOnly={true}
                />
            </Box>
        </div>
    )
}

export default FoodDetail
