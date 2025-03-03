"use client"

import { selectAuthUser } from "@/redux/features/auth/reducer"
import {
    deleteProductCategory,
    getProductCategories,
    selectIsLoadList,
    selectProductCategories,
} from "@/redux/features/productCategory/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IHeading, ILayoutParams, IListRequest } from "@/types/common"
import { ACTIONS, LIST_REQUEST_DEFAULT, TABLE_CELL_DATA_TYPE } from "@/utils/constants"
import {
    createParams,
    dispatchAction,
    filterPagingClientSide,
    getPermissionActionByPathname,
    getQueryParams,
    pushNewRoute,
    showConfirmation,
} from "@/utils/helpers/common"
import { Box, Grid } from "@mui/material"
import { useTranslations } from "next-intl"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
    SearchActions,
    InputField,
    RadioGroupField,
    PageHeading,
    DataTable,
    PagePagination,
} from "@/views/DynamicComponent/DynamicComponent"
import { IProductCategory } from "@/types/productCategory"

const ProductCategories = ({ params: { locale } }: { params: ILayoutParams }) => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const [queryList, setQueryList] = useState(LIST_REQUEST_DEFAULT)
    const [actions, setActions] = useState([] as string[])
    const [displayItems, setDisplayItems] = useState([] as IProductCategory[])
    const [totalRecords, setTotalRecords] = useState(1)

    const searchParams = useSearchParams()

    const currentUser = useAppSelector(selectAuthUser)

    const isLoadedList = useAppSelector(selectIsLoadList)
    const pathname = usePathname()

    const listItems = useAppSelector(selectProductCategories)
    const headings: IHeading[] = [
        { key: "id", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.id" },
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
            key: "createdBy.name",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.createdBy",
        },
        {
            key: "enabled",
            type: TABLE_CELL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    useEffect(() => {
        if (currentUser) {
            const permissionActions = getPermissionActionByPathname(pathname, currentUser)
            setActions(permissionActions)
        }
    }, [currentUser, pathname])

    useEffect(() => {
        if (currentUser && !isLoadedList) {
            fetchProductCategories()
        }
    }, [currentUser, isLoadedList])

    useEffect(() => {
        const params = getQueryParams(searchParams)
        const newQueryList = { ...queryList, ...params }
        reset(params.params)
        formatDisplayData(newQueryList)
    }, [searchParams, listItems])

    const { control, handleSubmit, reset } = useForm()

    const fetchProductCategories = async () => {
        await dispatch(getProductCategories())
    }

    const formatDisplayData = (data: IListRequest) => {
        const displayData = filterPagingClientSide([...listItems], data, locale)
        setTotalRecords(displayData.totalRecords)
        setDisplayItems(displayData.data)
        setQueryList(data)
        pushNewRoute(data)
    }

    const onChangePage = (value: number) => {
        formatDisplayData({ ...queryList, page: value })
    }

    const getTotalPage = () => {
        return Math.ceil(totalRecords / queryList.perPage)
    }

    const onSearch = (data: Record<string, any>) => {
        const params = Object.keys(createParams(data)).length ? createParams(data) : undefined
        formatDisplayData({ ...queryList, params, page: 1 })
    }

    const onClear = () => {
        reset()
        formatDisplayData(LIST_REQUEST_DEFAULT)
    }

    const deleteProductCategoryItem = (id: number) => {
        dispatchAction(dispatch, deleteProductCategory({ id }), t("message.itemIsDeleteSuccessful"))
    }

    const onDelete = (id: number) => {
        showConfirmation(t("swal.confirmTitle"), t("swal.confirmDeleteText"), () =>
            deleteProductCategoryItem(id),
        )
    }

    return (
        <div>
            <PageHeading
                title={t("productCategory.productCategory")}
                permissionActions={actions}
                pageActions={[ACTIONS.create]}
                currentPathname={pathname}
            />
            <Box sx={{ marginBottom: "10px", fontSize: "16px" }}>
                <form id="client-form" onSubmit={handleSubmit(onSearch)} action="">
                    <Grid container spacing={2} sx={{ marginBottom: "5px" }}>
                        <Grid item xs={4}>
                            <InputField
                                control={control}
                                name="name"
                                id="name"
                                label={t("common.name")}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <RadioGroupField
                                options={[
                                    { label: t("common.enabled"), value: true },
                                    { label: t("common.disabled"), value: false },
                                ]}
                                control={control}
                                name="enabled"
                                label={t("common.isActive")}
                            />
                        </Grid>
                    </Grid>
                    <SearchActions reset={onClear} />
                </form>
            </Box>
            <DataTable
                headings={headings}
                data={displayItems}
                actions={actions}
                deleteItem={onDelete}
                currentPathName={pathname}
            />
            <PagePagination
                totalPage={getTotalPage()}
                page={queryList.page}
                setPage={onChangePage}
            />
        </div>
    )
}

export default ProductCategories
