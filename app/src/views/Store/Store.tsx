"use client"

import SelectField from "@/components/Form/SelectField"
import { selectAuthUser } from "@/redux/features/auth/reducer"
import { deleteBrand } from "@/redux/features/brand/reducer"
import { getStores, selectIsLoadStoreList, selectStores } from "@/redux/features/store/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IBrand } from "@/types/brand"
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
import { useFetchBrand } from "@/utils/hooks/useFetchBrand"
import {
    DataTable,
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

const Store = ({ params: { locale } }: { params: ILayoutParams }) => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const [queryList, setQueryList] = useState(LIST_REQUEST_DEFAULT)
    const [actions, setActions] = useState([] as string[])
    const [displayItems, setDisplayItems] = useState([] as IBrand[])
    const [totalRecords, setTotalRecords] = useState(1)

    const searchParams = useSearchParams()

    const currentUser = useAppSelector(selectAuthUser)
    const isLoadedList = useAppSelector(selectIsLoadStoreList)
    const pathname = usePathname()

    const listItems = useAppSelector(selectStores)

    const headings: IHeading[] = [
        { key: "id", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: `name.${locale}`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.name",
        },
        {
            key: `time.${locale}`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.time",
        },
        {
            key: `code`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.code",
        },
        {
            key: `thumbnail`,
            type: TABLE_CELL_DATA_TYPE.IMAGE,
            keyLabel: "common.thumbnail",
        },
        {
            key: `coverImage`,
            type: TABLE_CELL_DATA_TYPE.IMAGE,
            keyLabel: "common.coverImage",
        },
        {
            key: `brand.name.${locale}`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.brand",
        },
        {
            key: "enabled",
            type: TABLE_CELL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]
    const brands = useFetchBrand(locale)
    const fetchStores = async () => {
        await dispatch(getStores())
    }

    useEffect(() => {
        if (currentUser && !isLoadedList) {
            fetchStores()
        }
    }, [currentUser, isLoadedList])

    const { handleSubmit, reset, control } = useForm()

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
        formatDisplayData(newQueryList)
    }, [searchParams, listItems])

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
        const params = createParams(data)

        if (Object.keys(params).length === 0) {
            formatDisplayData({ ...queryList, page: 1 })
        } else {
            formatDisplayData({ ...queryList, params, page: 1 })
        }
    }

    const onClear = () => {
        reset()
        formatDisplayData(LIST_REQUEST_DEFAULT)
    }

    const deleteBrandItem = (id: number) => {
        dispatchAction(dispatch, deleteBrand({ id }), t("message.itemIsDeleteSuccessful"))
    }

    const onDelete = (id: number) => {
        showConfirmation(t("swal.confirmTitle"), t("swal.confirmDeleteText"), () =>
            deleteBrandItem(id),
        )
    }

    return (
        <div>
            <PageHeading
                title={t("store.store")}
                permissionActions={actions}
                pageActions={[ACTIONS.create]}
                currentPathname={pathname}
            />
            <Box sx={{ marginBottom: "10px", fontSize: "16px" }}>
                <form id="client-form" onSubmit={handleSubmit(onSearch)} action="">
                    <Grid container spacing={2} sx={{ marginBottom: "5px" }}>
                        <Grid item xs={4}>
                            <SelectField
                                control={control}
                                name="brandId"
                                options={brands.listItemOptions}
                                label={t("common.brand")}
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

export default Store
