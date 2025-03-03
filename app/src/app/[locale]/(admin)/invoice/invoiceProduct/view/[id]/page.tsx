"use client"

import {
    getInvoiceProductDetail,
    selectInvoiceProductDetail,
} from "@/redux/features/invoiceProduct/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IDetailField, IHeading } from "@/types/common"
import { IInvoiceProductItem } from "@/types/invoiceProduct"
import { ACTION_PATH, DETAIL_DATA_TYPE, TABLE_CELL_DATA_TYPE } from "@/utils/constants"
import { backMainPage } from "@/utils/helpers/common"
import {
    DataTable,
    DetailContent,
    FormActions,
    PageHeading,
} from "@/views/DynamicComponent/DynamicComponent"
import { Grid, Box } from "@mui/material"
import { useLocale, useTranslations } from "next-intl"
import { useParams, usePathname, useRouter } from "next/navigation"
import { Fragment, useEffect } from "react"

const InvoiceProductDetail = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()

    const item = useAppSelector(selectInvoiceProductDetail)
    const fields: IDetailField[] = [
        { key: "id", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: "invoiceNumber",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "invoice.invoiceNumber",
        },
        {
            key: "deliveryType",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "invoice.product.deliveryType",
        },
        {
            key: "deliveryFee",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "invoice.product.deliveryFee",
        },
        {
            key: "shippingDate",
            type: DETAIL_DATA_TYPE.DATE,
            keyLabel: "invoice.product.shippingDate",
        },
        {
            key: "shippingBlockTime",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "invoice.product.shippingBlockTime",
        },
        {
            key: "fullAddress",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "invoice.product.fullAddress",
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
        { key: "facebook", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.facebook" },
        { key: "longitude", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.longitude" },
        { key: "latitude", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.latitude" },
        { key: "thumbnail", type: DETAIL_DATA_TYPE.IMAGE, keyLabel: "invoice.store.thumbnail" },
        { key: "coverImage", type: DETAIL_DATA_TYPE.IMAGE, keyLabel: "common.coverImage" },
        {
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const memberAddressFields: IDetailField[] = [
        { key: "id", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: "addressTitle",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "invoice.memberAddress.addressTitle",
        },
        { key: "name", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "invoice.member.name" },
        { key: "phone", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "invoice.member.phone" },
        {
            key: "address",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.address",
        },
        {
            key: "default",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "invoice.memberAddress.default",
        },
        {
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const itemHeadings: IHeading[] = [
        {
            key: `product.name.${locale}`,
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
            key: `thumbnail`,
            type: TABLE_CELL_DATA_TYPE.IMAGE,
            keyLabel: "common.thumbnail",
        },
        {
            key: `published`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.published",
        },
        {
            key: `unpublished`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.unpublished",
        },
        {
            key: `discount`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.discount",
        },
        {
            key: `enabled`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.enabled",
        },
    ]

    const fetchItem = async () => {
        await dispatch(getInvoiceProductDetail({ id: id as unknown as number }))
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

            {!!item.memberAddress && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2} sx={{ marginTop: "0px" }}>
                            <Grid item xs={12}>
                                <h4>{t("invoice.memberAddress.memberAddress")}</h4>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ marginTop: "0px", marginBottom: "10px" }}>
                            <Grid item xs={12}>
                                <DetailContent
                                    data={item.memberAddress}
                                    fields={memberAddressFields}
                                />
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
                            {item.items.map((item: IInvoiceProductItem, itemIndex: number) => (
                                <Fragment key={itemIndex}>
                                    <Grid item xs={1} textAlign="end">
                                        <p>{itemIndex + 1}. </p>
                                    </Grid>
                                    <Grid item xs={11}>
                                        <DataTable
                                            locale={locale}
                                            headings={itemHeadings}
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

export default InvoiceProductDetail
