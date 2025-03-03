"use client"

import { selectAuthUser } from "@/redux/features/auth/reducer"
import {
    changeStatusProduct,
    getProducts,
    selectProductPaginations,
    selectProducts,
} from "@/redux/features/product/reducer"

import DatePickerField from "@/components/Form/DatePickerField"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IHeading, ILayoutParams, IListRequest } from "@/types/common"
import { IChickenPotProductDetail } from "@/types/product"
import {
    ACTIONS,
    LIST_REQUEST_DEFAULT,
    TABLE_CELL_DATA_TYPE
} from "@/utils/constants"
import {
    createParams,
    formatDataSearch,
    getPermissionActionByPathname,
    getQueryParams,
    pushNewRoute,
    showConfirmation,
    transformDate,
} from "@/utils/helpers/common"
import {
    DataTable,
    InputField,
    PageHeading,
    PagePagination,
    RadioGroupField,
    SearchActions,
} from "@/views/DynamicComponent/DynamicComponent"
import { Box, Grid } from "@mui/material"
import { useTranslations } from "next-intl"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

const Products = ({ params: { locale } }: { params: ILayoutParams }) => {
    const t = useTranslations()
    const [queryList, setQueryList] = useState(LIST_REQUEST_DEFAULT)
    const [actions, setActions] = useState([] as string[])
    const dispatch = useAppDispatch()

    const searchParams = useSearchParams()

    const currentUser = useAppSelector(selectAuthUser)
    const pathname = usePathname()

    const listItems = useAppSelector(selectProducts)
    const paginationData = useAppSelector(selectProductPaginations)

    const headings: IHeading[] = [
        {
            key: "id",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.id",
        },
        {
            key: `name.${locale}`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.name",
        },
        {
            key: "thumbnail",
            type: TABLE_CELL_DATA_TYPE.IMAGE,
            keyLabel: "common.thumbnail",
        },
        {
            key: `unpublished`,
            type: TABLE_CELL_DATA_TYPE.DATETIME,
            keyLabel: "common.unpublished",
        },
        {
            key: "price",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.price",
        },

        {
            key: "bestSeller",
            type: TABLE_CELL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.bestSeller",
        },
        {
            key: "popular",
            type: TABLE_CELL_DATA_TYPE.BOOLEAN,
            keyLabel: "product.popular",
        },
        {
            key: "enabled",
            type: TABLE_CELL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const fetchProducts = async (pagination: IListRequest) => {
        const searchParams = formatDataSearch(pagination)
        await dispatch(getProducts(searchParams))
        setQueryList(pagination)
        pushNewRoute(pagination)
    }

    useEffect(() => {
        if (currentUser) {
            const permissionActions = getPermissionActionByPathname(pathname, currentUser)
            setActions(permissionActions)
        }
    }, [currentUser, pathname])

    useEffect(() => {
        const params = getQueryParams(searchParams)
        const newQueryList = { ...queryList, ...params }
        reset(params.params)
        fetchProducts(newQueryList)
    }, [searchParams])

    const onChangePage = (value: number) => {
        fetchProducts({ ...queryList, page: value })
    }

    const { handleSubmit, control, reset } = useForm({})

    const onSearch = (data: Record<string, any>) => {
        const payload = {
            ...data,
            publishFrom: data.publishFrom ? transformDate(data.publishFrom) : undefined,
            publishTo: data.publishTo ? transformDate(data.publishTo) : undefined,
        }

        const params = Object.keys(createParams(payload)).length ? createParams(payload) : undefined
        fetchProducts({ ...queryList, params, page: 1 })
    }

    const onClear = () => {
        reset()
        fetchProducts(LIST_REQUEST_DEFAULT)
    }

    const dispatchAction = async (action: any, successMessage: string) => {
        const value = await dispatch(action)
        if (!(value as any)?.error) {
            toast.success(successMessage)
            fetchProducts({ ...queryList })
        }
    }

    const changeStatusItem = (item: IChickenPotProductDetail) => {
        if (item) {
            const successMessage = item.enabled
                ? "message.itemIsDisableSuccessful"
                : "message.itemIsEnableSuccessful"
            dispatchAction(
                changeStatusProduct({ id: item.id, enabled: !item.enabled }),
                t(successMessage),
            )
        }
    }

    const onChangeStatus = (item: IChickenPotProductDetail) => {
        const confirmText = item.enabled ? "swal.confirmDisableText" : "swal.confirmEnableText"
        showConfirmation(t("swal.confirmTitle"), t(confirmText), () => changeStatusItem(item))
    }

    return (
        <div>
            <PageHeading
                title={t("product.product")}
                permissionActions={actions}
                pageActions={[ACTIONS.create]}
                currentPathname={pathname}
            />
            <Box sx={{ marginBottom: "10px", fontSize: "16px" }}>
                <form id="client-form" onSubmit={handleSubmit(onSearch)}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <InputField
                                name="name"
                                control={control}
                                label={t("product.productName")}
                                id="name"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <DatePickerField
                                format="YYYY-MM-DD"
                                control={control}
                                name={`publishFrom`}
                                label={t("common.publishFrom")}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <DatePickerField
                                format="YYYY-MM-DD"
                                control={control}
                                name={`publishTo`}
                                label={t("common.publishTo")}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <InputField
                                name="priceFrom"
                                control={control}
                                label={t("product.priceFrom")}
                                id="name"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <InputField
                                name="priceTo"
                                control={control}
                                label={t("product.priceTo")}
                                id="name"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <RadioGroupField
                                options={[
                                    { label: t("common.enabled"), value: true },
                                    { label: t("common.disabled"), value: false },
                                ]}
                                name="enabled"
                                control={control}
                                label={t("common.isActive")}
                            />
                        </Grid>
                    </Grid>
                    <SearchActions reset={onClear} />
                </form>
            </Box>
            <DataTable
                headings={headings}
                data={listItems}
                actions={actions}
                changeStatus={onChangeStatus}
                currentPathName={pathname}
            />
            <PagePagination
                totalPage={paginationData.totalPage}
                page={queryList.page}
                setPage={onChangePage}
            />
        </div>
    )
}

export default Products
