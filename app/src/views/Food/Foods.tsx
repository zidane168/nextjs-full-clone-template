"use client"

import { selectAuthUser } from "@/redux/features/auth/reducer"
import {
    getFoods,
    selectFoodPaginations,
    selectFoods,
    selectIsLoadFoodList,
} from "@/redux/features/food/reducer"
import { deleteProductCategory } from "@/redux/features/productCategory/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IHeading, ILayoutParams, IListRequest } from "@/types/common"
import { ACTIONS, LIST_REQUEST_DEFAULT, TABLE_CELL_DATA_TYPE } from "@/utils/constants"
import {
    createParams,
    dispatchAction,
    formatDataSearch,
    getPermissionActionByPathname,
    getQueryParams,
    pushNewRoute,
    showConfirmation,
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

const Foods = ({ params: { locale } }: { params: ILayoutParams }) => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const [queryList, setQueryList] = useState({ ...LIST_REQUEST_DEFAULT, orderBy: "createdAt" })
    const [actions, setActions] = useState([] as string[])

    const searchParams = useSearchParams()
    const currentUser = useAppSelector(selectAuthUser)
    const pathname = usePathname()

    // const brands = useFetchBrand(locale)
    const listItems = useAppSelector(selectFoods)
    const isLoadedList = useAppSelector(selectIsLoadFoodList)
    const paginationData = useAppSelector(selectFoodPaginations)

    const { control, handleSubmit, reset } = useForm()

    const headings: IHeading[] = [
        { key: "id", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: `name.${locale}`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.name",
        },
        {
            key: `category.name.${locale}`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "food.category.name",
        },
        {
            key: "thumbnail",
            type: TABLE_CELL_DATA_TYPE.IMAGE,
            keyLabel: "common.thumbnail",
        },
        {
            key: "published",
            type: TABLE_CELL_DATA_TYPE.DATE,
            keyLabel: "common.published",
        },
        {
            key: "unpublished",
            type: TABLE_CELL_DATA_TYPE.DATE,
            keyLabel: "common.unpublished",
        },
        {
            key: "price",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.price",
        },
        {
            key: "discount",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.discount",
        },
        // {
        //     key: `brand.name.${locale}`,
        //     type: TABLE_CELL_DATA_TYPE.TEXT,
        //     keyLabel: "common.brand",
        // },
        {
            key: "createdBy.name",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.createdBy",
        },
        {
            key: "popular",
            type: TABLE_CELL_DATA_TYPE.BOOLEAN,
            keyLabel: "food.popular",
        },
        {
            key: "bestSeller",
            type: TABLE_CELL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.bestSeller",
        },
        {
            key: "enabled",
            type: TABLE_CELL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const fetchFoods = async (pagination: IListRequest) => {
        const searchParams = formatDataSearch(pagination)
        await dispatch(getFoods(searchParams))
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
        fetchFoods(newQueryList)
    }, [searchParams, isLoadedList])

    const onChangePage = (value: number) => {
        fetchFoods({ ...queryList, page: value })
    }

    const onSearch = (data: Record<string, any>) => {
        const params = Object.keys(createParams(data)).length ? createParams(data) : undefined
        fetchFoods({ ...queryList, params, page: 1 })
    }

    const onClear = () => {
        reset()
        fetchFoods({ ...LIST_REQUEST_DEFAULT, orderBy: "createdAt" })
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
                title={t("food.food")}
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
                        {/* <Grid item xs={4}>
                            <SelectField
                                control={control}
                                name="brandId"
                                label={t("common.brand")}
                                options={brands.listItemOptions}
                            />
                        </Grid> */}
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
                data={listItems}
                actions={actions}
                deleteItem={onDelete}
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

export default Foods
