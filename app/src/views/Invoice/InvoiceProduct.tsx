"use client"

import { selectAuthUser } from "@/redux/features/auth/reducer"
import {
    changeStatusInvoiceProduct,
    getInvoiceProduct,
    selectInvoiceProduct,
    selectInvoiceProductPaginations,
} from "@/redux/features/invoiceProduct/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IHeading, ILayoutParams, IListRequest, ISelectOption } from "@/types/common"
import { IInvoiceProduct } from "@/types/invoiceProduct"
import {
    PRODUCT_INVOICE_STATUS,
    LIST_REQUEST_DEFAULT,
    TABLE_CELL_DATA_TYPE,
} from "@/utils/constants"
import {
    createParams,
    formatDataSearch,
    getPermissionActionByPathname,
    getQueryParams,
    pushNewRoute,
} from "@/utils/helpers/common"
import {
    DataTable,
    InputField,
    PageHeading,
    PagePagination,
    SearchActions,
    SelectField,
} from "@/views/DynamicComponent/DynamicComponent"
import { Box, Grid } from "@mui/material"
import { useTranslations } from "next-intl"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

const InvoiceProduct = ({ params: { locale } }: { params: ILayoutParams }) => {
    const t = useTranslations()
    const [queryList, setQueryList] = useState(LIST_REQUEST_DEFAULT)
    const [actions, setActions] = useState([] as string[])
    const dispatch = useAppDispatch()

    const searchParams = useSearchParams()

    const currentUser = useAppSelector(selectAuthUser)
    const pathname = usePathname()

    const listItems = useAppSelector(selectInvoiceProduct)
    const paginationData = useAppSelector(selectInvoiceProductPaginations)

    const headings: IHeading[] = [
        { key: "id", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: "invoiceNumber",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.invoiceNumber",
        },
        {
            key: "subtotal",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.subtotal",
        },
        {
            key: "discount",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.discount",
        },
        {
            key: "total",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.total",
        },
        {
            key: "method",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.method",
        },
        {
            key: "status",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.status",
        },
        {
            key: "deliveryType",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.product.deliveryType",
        },
        {
            key: "deliveryFee",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.product.deliveryFee",
        },
        {
            key: "shippingDate",
            type: TABLE_CELL_DATA_TYPE.DATE,
            keyLabel: "invoice.product.shippingDate",
        },
        {
            key: "shippingBlockTime",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.product.shippingBlockTime",
        },
        {
            key: "fullAddress",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.product.fullAddress",
        },
        {
            key: "member.name",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.member.name",
        },
        {
            key: "member.email",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.member.email",
        },
        {
            key: "member.phone",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.member.phone",
        },
        {
            key: `store.name.${locale}`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.store.name",
        },
        {
            key: `store.code`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.code",
        },
        {
            key: `store.address.${locale}`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.store.address",
        },
        {
            key: `store.phone`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.store.phone",
        },
        {
            key: "createdAt",
            type: TABLE_CELL_DATA_TYPE.DATE,
            keyLabel: "common.createdAt",
        },
        {
            key: "updatedAt",
            type: TABLE_CELL_DATA_TYPE.DATE,
            keyLabel: "common.updatedAt",
        },
        {
            key: "enabled",
            type: TABLE_CELL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const fetchInvoiceProduct = async (pagination: IListRequest) => {
        const searchParams = formatDataSearch(pagination)
        await dispatch(getInvoiceProduct(searchParams))
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
        fetchInvoiceProduct(newQueryList)
    }, [searchParams])

    const onChangePage = (value: number) => {
        fetchInvoiceProduct({ ...queryList, page: value })
    }

    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            type: "",
        },
    })

    const onSearch = (data: Record<string, any>) => {
        const params = Object.keys(createParams(data)).length ? createParams(data) : undefined
        fetchInvoiceProduct({ ...queryList, params, page: 1 })
    }

    const onClear = () => {
        reset()
        fetchInvoiceProduct(LIST_REQUEST_DEFAULT)
    }

    const getInvoiceProductStatus = () => {
        return Object.entries(PRODUCT_INVOICE_STATUS).map(([key, value]) => {
            return {
                label: t(`invoice.${value}`),
                value: key,
            } as ISelectOption
        })
    }

    const dispatchAction = async (action: any, successMessage: string, refetch?: boolean) => {
        const value = await dispatch(action)
        if (!(value as any)?.error) {
            toast.success(successMessage)
            if (refetch) {
                fetchInvoiceProduct({ ...queryList })
            }
        }
    }

    const changeStatusItem = (item: IInvoiceProduct, newStatus: PRODUCT_INVOICE_STATUS) => {
        if (item) {
            dispatchAction(
                changeStatusInvoiceProduct({
                    id: item.id,
                    status: newStatus,
                }),
                t("message.changeStatusSuccessful"),
                true,
            )
        }
    }

    const getOptionsBasedOnStatus = (status: PRODUCT_INVOICE_STATUS) => {
        const allOptions = getInvoiceProductStatus()

        const statusOptionsMap: { [key in PRODUCT_INVOICE_STATUS]?: string[] } = {
            PAID: [t("invoice.COMPLETED"), t("invoice.CANCELLED"), t("invoice.VOID")],
            COMPLETED: [t("invoice.VOID"), t("invoice.CANCELLED")],
        }

        const filteredOptions = allOptions.filter(option =>
            statusOptionsMap[status] ? statusOptionsMap[status]!.includes(option.label) : true,
        )

        return filteredOptions.reduce((obj: { [key: string]: string }, item) => {
            obj[item.value] = item.label
            return obj
        }, {})
    }

    const onChangeStatusInvoiceProduct = async (item: IInvoiceProduct) => {
        const formattedOptions = getOptionsBasedOnStatus(item.status)
        const { value: status } = await Swal.fire({
            title: t("swal.changeStatusInvoiceTitle"),
            input: "select",
            inputOptions: formattedOptions,
            inputPlaceholder: t("swal.changeStatusInvoicePlaceholder"),
            showCancelButton: true,
            cancelButtonText: t("common.cancel"),
            confirmButtonText: t("swal.OK"),
            inputValidator: value => {
                return new Promise(resolve => {
                    if (!value) {
                        resolve(t("validation.itemIsRequiredField"))
                    } else {
                        resolve("")
                    }
                })
            },
        })
        if (status) {
            changeStatusItem(item, status)
        }
    }

    return (
        <div>
            <PageHeading
                title={t("invoice.product.invoiceProduct")}
                permissionActions={actions}
                currentPathname={pathname}
            />
            <Box sx={{ marginBottom: "10px", fontSize: "16px" }}>
                <form id="client-form" onSubmit={handleSubmit(onSearch)} action="">
                    <Grid container spacing={2} sx={{ marginBottom: "5px" }}>
                        <Grid item xs={6}>
                            <SelectField
                                control={control}
                                defaultValue=""
                                name="status"
                                isAllOption={true}
                                label={t("invoice.status")}
                                options={getInvoiceProductStatus()}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <InputField
                                name="invoiceNumber"
                                control={control}
                                label={t("invoice.invoiceNumber")}
                                id="invoiceNumber"
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
                currentPathName={pathname}
                isEditItem={false}
                changeStatusInvoice={onChangeStatusInvoiceProduct}
            />
            <PagePagination
                totalPage={paginationData.totalPage}
                page={queryList.page}
                setPage={onChangePage}
            />
        </div>
    )
}

export default InvoiceProduct
