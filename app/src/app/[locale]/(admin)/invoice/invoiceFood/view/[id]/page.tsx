"use client"

import { getInvoiceFoodDetail, selectInvoiceFoodDetail } from "@/redux/features/invoiceFood/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IDetailField, IHeading } from "@/types/common"
import { IInvoiceFoodItem } from "@/types/invoiceFood"
import { ACTION_PATH, DETAIL_DATA_TYPE, TABLE_CELL_DATA_TYPE } from "@/utils/constants"
import { backMainPage } from "@/utils/helpers/common"
import {
    DataTable,
    DetailContent,
    FormActions,
    PageHeading,
} from "@/views/DynamicComponent/DynamicComponent"
import { Box, Grid } from "@mui/material"
import { useLocale, useTranslations } from "next-intl"
import { useParams, usePathname, useRouter } from "next/navigation"
import { Fragment, useEffect } from "react"

const InvoiceFoodDetail = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()

    const item = useAppSelector(selectInvoiceFoodDetail)
    const fields: IDetailField[] = [
        { key: "id", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: "invoiceNumber",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "invoice.invoiceNumber",
        },
        {
            key: "pickupDate",
            type: DETAIL_DATA_TYPE.DATE,
            keyLabel: "invoice.food.pickupDate",
        },
        {
            key: "pickupTime",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "invoice.food.pickupTime",
        },
        {
            key: "subtotal",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "invoice.subtotal",
        },
        {
            key: "discount",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.discount",
        },
        {
            key: "total",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "invoice.total",
        },
        {
            key: "method",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "invoice.method",
        },
        {
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
        {
            key: "status",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "invoice.status",
        },
        {
            key: "createdAt",
            type: DETAIL_DATA_TYPE.DATE,
            keyLabel: "common.createdAt",
        },
        {
            key: "updatedAt",
            type: DETAIL_DATA_TYPE.DATE,
            keyLabel: "common.updatedAt",
        },
    ]

    const memberFields: IDetailField[] = [
        { key: "id", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        { key: "title", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "invoice.member.title" },
        { key: "name", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "invoice.member.name" },
        { key: "email", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "invoice.member.email" },
        { key: "phone", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "invoice.member.phone" },
        { key: "dob", type: DETAIL_DATA_TYPE.DATE, keyLabel: "invoice.member.dob" },
        { key: "gender", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "invoice.member.gender" },
        {
            key: "isNotifiable",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "invoice.member.isNotifiable",
        },
        {
            key: "isEmailVerified",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "invoice.member.isEmailVerified",
        },
        {
            key: "isPhoneVerified",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "invoice.member.isPhoneVerified",
        },
        {
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
        {
            key: "createdAt",
            type: DETAIL_DATA_TYPE.DATE,
            keyLabel: "common.createdAt",
        },
        {
            key: "updatedAt",
            type: DETAIL_DATA_TYPE.DATE,
            keyLabel: "common.updatedAt",
        },
    ]

    const storeFields: IDetailField[] = [
        { key: "id", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        { key: "createdBy", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.createdBy" },
        { key: "updatedBy", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.updatedBy" },
        { key: `name.${locale}`, type: DETAIL_DATA_TYPE.TEXT, keyLabel: "invoice.store.name" },
        { key: "code", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.code" },
        {
            key: `address.${locale}`,
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "invoice.store.address",
        },
        {
            key: `introduction.${locale}`,
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.introduction",
        },
        {
            key: `time.${locale}`,
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.time",
        },
        { key: "phone", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "invoice.store.phone" },
        { key: "facebook", type: DETAIL_DATA_TYPE.LINK, keyLabel: "common.facebook" },
        { key: "longitude", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.longitude" },
        { key: "latitude", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.latitude" },
        { key: "thumbnail", type: DETAIL_DATA_TYPE.IMAGE, keyLabel: "common.thumbnail" },
        { key: "coverImage", type: DETAIL_DATA_TYPE.IMAGE, keyLabel: "common.coverImage" },
        {
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const itemHeadings: IHeading[] = [
        {
            key: `food.name.${locale}`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.item.food.name",
        },
        { key: "quantity", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.quantity" },
        {
            key: "price",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.price",
        },
        {
            key: `unitPrice`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.item.unitPrice",
        },
        {
            key: `food.thumbnail`,
            type: TABLE_CELL_DATA_TYPE.IMAGE,
            keyLabel: "common.thumbnail",
        },
        {
            key: `food.published`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.published",
        },
        {
            key: `food.unpublished`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.unpublished",
        },
        {
            key: `food.discount`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.discount",
        },
        {
            key: `food.sort`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.sort",
        },
        {
            key: `food.enabled`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.enabled",
        },
        {
            key: `extras`,
            type: TABLE_CELL_DATA_TYPE.TABLE,
            keyLabel: "food.extras.title",
        },
    ]

    const extraHeadings: IHeading[] = [
        {
            key: `name.${locale}`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.item.extra.name",
        },
        {
            key: `limit`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "food.extras.limit",
        },

        {
            key: `sort`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.sort",
        },
        {
            key: `reqOpt`,
            type: TABLE_CELL_DATA_TYPE.BOOLEAN,
            keyLabel: "food.extras.reqOpt",
        },
        {
            key: `details`,
            type: TABLE_CELL_DATA_TYPE.NESTED_TABLE,
            keyLabel: "food.extras.details.title",
        },
    ]

    const detailHeadings: IHeading[] = [
        { key: "id", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        { key: `name.${locale}`, type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.name" },
        { key: `price`, type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.price" },
        { key: `sort`, type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.sort" },
    ]

    const fetchItem = async () => {
        await dispatch(getInvoiceFoodDetail({ id: id as unknown as number }))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("invoice.view")} currentPathname={pathname} />
            <DetailContent data={item} fields={fields} />

            {!!item.member && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2} sx={{ marginTop: "0px" }}>
                            <Grid item xs={12}>
                                <h4>{t("invoice.member.member")}</h4>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ marginTop: "0px", marginBottom: "10px" }}>
                            <Grid item xs={12}>
                                <DetailContent data={item.member} fields={memberFields} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}

            {!!item.store && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2} sx={{ marginTop: "0px" }}>
                            <Grid item xs={12}>
                                <h4>{t("invoice.store.store")}</h4>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ marginTop: "0px", marginBottom: "10px" }}>
                            <Grid item xs={12}>
                                <DetailContent data={item.store} fields={storeFields} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}

            {!!item.items && item.items.length > 0 && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2} sx={{ marginTop: "0px" }}>
                            <Grid item xs={12}>
                                <h4>{t("invoice.item.items")}</h4>
                            </Grid>
                        </Grid>
                        <Grid container item spacing={2}>
                            {item.items.map((item: IInvoiceFoodItem, itemIndex: number) => (
                                <Fragment key={itemIndex}>
                                    <Grid item xs={1} textAlign="end">
                                        <p>{itemIndex + 1}. </p>
                                    </Grid>
                                    <Grid item xs={11}>
                                        <DataTable
                                            locale={locale}
                                            headings={itemHeadings}
                                            subHeadings={extraHeadings}
                                            subData={item.extras}
                                            nestedSubHeadings={detailHeadings}
                                            nestedSubDataName={"details"}
                                            data={[item]}
                                            onlyView={true}
                                        />
                                    </Grid>
                                </Fragment>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            )}

            <Box mt={15 / 8}>
                <FormActions
                    backMainPage={() => backMainPage(pathname, ACTION_PATH.view, router)}
                    viewOnly={true}
                />
            </Box>
        </div>
    )
}

export default InvoiceFoodDetail
