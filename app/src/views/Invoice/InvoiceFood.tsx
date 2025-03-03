"use client"

import { selectAuthUser } from "@/redux/features/auth/reducer"
import {
    changeStatusInvoiceFood,
    exportInvoiceFood,
    getInvoiceFood,
    selectInvoiceFood,
    selectInvoiceFoodPaginations,
} from "@/redux/features/invoiceFood/reducer"
import {
    getStores,
    selectIsLoadStoreList,
    selectStoreOptions,
} from "@/redux/features/store/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IHeading, ILayoutParams, IListRequest, ISelectOption } from "@/types/common"
import { IInvoiceFood } from "@/types/invoiceFood"
import {
    ACTIONS,
    FOOD_INVOICE_STATUS,
    LIST_REQUEST_DEFAULT,
    TABLE_CELL_DATA_TYPE,
} from "@/utils/constants"
import {
    createParams,
    formatDataSearch,
    formatDate,
    getPermissionActionByPathname,
    getQueryParams,
    pushNewRoute,
} from "@/utils/helpers/common"
import {
    DataTable,
    DatePickerField,
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

const InvoiceFood = ({ params: { locale } }: { params: ILayoutParams }) => {
    const t = useTranslations()
    const [queryList, setQueryList] = useState(LIST_REQUEST_DEFAULT)
    const [actions, setActions] = useState([] as string[])
    const dispatch = useAppDispatch()

    const searchParams = useSearchParams()

    const currentUser = useAppSelector(selectAuthUser)
    const pathname = usePathname()

    const listItems = useAppSelector(selectInvoiceFood)
    const paginationData = useAppSelector(selectInvoiceFoodPaginations)

    const storeOptions = useAppSelector(selectStoreOptions(locale))
    const isLoadStoreList = useAppSelector(selectIsLoadStoreList)

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
            key: "pickupDate",
            type: TABLE_CELL_DATA_TYPE.DATE,
            keyLabel: "invoice.food.pickupDate",
        },
        {
            key: "pickupTime",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "invoice.food.pickupTime",
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

    const fetchStoreDatas = async () => {
        await dispatch(getStores())
    }

    const fetchInvoiceFood = async (pagination: IListRequest) => {
        const searchParams = formatDataSearch(pagination)
        await dispatch(getInvoiceFood(searchParams))
        setQueryList(pagination)
        pushNewRoute(pagination)
    }

    const onChangePage = (value: number) => {
        fetchInvoiceFood({ ...queryList, page: value })
    }

    const { handleSubmit, control, reset, getValues } = useForm({
        defaultValues: {
            type: "",
        },
    })

    const onSearch = (data: Record<string, any>) => {
        data.pickupDate = formatDate(data.pickupDate)
        const params = Object.keys(createParams(data)).length ? createParams(data) : undefined
        fetchInvoiceFood({ ...queryList, params, page: 1 })
    }

    const onClear = () => {
        reset()
        fetchInvoiceFood(LIST_REQUEST_DEFAULT)
    }

    const getInvoiceFoodStatus = () => {
        return Object.entries(FOOD_INVOICE_STATUS).map(([key, value]) => {
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
                fetchInvoiceFood({ ...queryList })
            }
        }
    }

    const changeStatusItem = (item: IInvoiceFood, newStatus: FOOD_INVOICE_STATUS) => {
        if (item) {
            dispatchAction(
                changeStatusInvoiceFood({
                    id: item.id,
                    status: newStatus,
                }),
                t("message.changeStatusSuccessful"),
                true,
            )
        }
    }

    const getOptionsBasedOnStatus = (status: FOOD_INVOICE_STATUS) => {
        const allOptions = getInvoiceFoodStatus()

        const statusOptionsMap: { [key in FOOD_INVOICE_STATUS]?: string[] } = {
            PAID: [
                t("invoice.COMPLETED"),
                t("invoice.CANCELLED"),
                t("invoice.VOID"),
                t("invoice.MAKING_FOOD"),
                t("invoice.READY_FOR_PICK_UP"),
            ],
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

    const onChangeStatusInvoiceFood = async (item: IInvoiceFood) => {
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

    const exportInvoiceFoods = async () => {
        const values = getValues()
        const plainParams: Record<string, string> = {}

        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") plainParams[key] = value
        })

        plainParams["perPage"] = "1000"
        const formattedPickupDate = formatDate(plainParams["pickupDate"])

        if (formattedPickupDate === undefined) {
            delete plainParams["pickupDate"]
        } else {
            plainParams["pickupDate"] = formattedPickupDate
        }
        const value = await dispatch(exportInvoiceFood(plainParams))
        if (!(value as any)?.error) {
            window.open((value as any).payload.pathFile, "_self")
        }
    }

    useEffect(() => {
        if (!isLoadStoreList) fetchStoreDatas()
    }, [isLoadStoreList])

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
        fetchInvoiceFood(newQueryList)
    }, [searchParams])

    return (
        <div>
            <PageHeading
                title={t("invoice.food.invoiceFood")}
                permissionActions={actions}
                pageActions={[ACTIONS.export]}
                onExport={exportInvoiceFoods}
                currentPathname={pathname}
            />
            <Box sx={{ marginBottom: "10px", fontSize: "16px" }}>
                <form id="client-form" onSubmit={handleSubmit(onSearch)} action="">
                    <Grid container spacing={2} sx={{ marginBottom: "5px" }}>
                        <Grid item xs={3}>
                            <SelectField
                                control={control}
                                defaultValue=""
                                name="storeId"
                                isAllOption={true}
                                label={t("invoice.food.store")}
                                options={storeOptions}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <SelectField
                                control={control}
                                defaultValue=""
                                name="status"
                                isAllOption={true}
                                label={t("invoice.status")}
                                options={getInvoiceFoodStatus()}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <InputField
                                name="invoiceNumber"
                                control={control}
                                label={t("invoice.invoiceNumber")}
                                id="invoiceNumber"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <DatePickerField
                                name="pickupDate"
                                label={t("invoice.food.pickupDate")}
                                control={control}
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
                changeStatusInvoice={onChangeStatusInvoiceFood}
            />
            <PagePagination
                totalPage={paginationData.totalPage}
                page={queryList.page}
                setPage={onChangePage}
            />
        </div>
    )
}

export default InvoiceFood
