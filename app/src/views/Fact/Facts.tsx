"use client"

import { selectAuthUser } from "@/redux/features/auth/reducer"
import {
    changeStatusFact,
    deleteFact,
    getFacts,
    selectFacts,
    selectIsFactLoadList,
} from "@/redux/features/fact/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IHeading, ILayoutParams, IListRequest } from "@/types/common"
import { IFact } from "@/types/fact"
import {
    ACTIONS,
    FACT_TYPE_OPTIONS,
    LIST_REQUEST_DEFAULT,
    TABLE_CELL_DATA_TYPE,
} from "@/utils/constants"
import {
    createParams,
    dispatchAction,
    filterPagingClientSide,
    getPermissionActionByPathname,
    getQueryParams,
    pushNewRoute,
    showConfirmation,
} from "@/utils/helpers/common"
import {
    DataTable,
    PageHeading,
    PagePagination,
    RadioGroupField,
    SearchActions,
    SelectField,
} from "@/views/DynamicComponent/DynamicComponent"
import { Box, Grid } from "@mui/material"
import { useTranslations } from "next-intl"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const Facts = ({ params: { locale } }: { params: ILayoutParams }) => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const [queryList, setQueryList] = useState(LIST_REQUEST_DEFAULT)
    const [actions, setActions] = useState([] as string[])
    const [displayItems, setDisplayItems] = useState([] as IFact[])
    const [totalRecords, setTotalRecords] = useState(1)

    const searchParams = useSearchParams()

    const currentUser = useAppSelector(selectAuthUser)
    const isFactLoadedList = useAppSelector(selectIsFactLoadList)
    const pathname = usePathname()

    const listItems = useAppSelector(selectFacts)

    const headings: IHeading[] = [
        { key: "id", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: `name.${locale}`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.name",
        },
        { key: "type", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.type" },
        {
            key: `thumbnail`,
            type: TABLE_CELL_DATA_TYPE.IMAGE,
            keyLabel: "common.thumbnail",
        },
        {
            key: "createdBy.name",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.createdBy",
        },
        {
            key: "updatedBy.name",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.updatedBy",
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

    const fetchList = async () => {
        await dispatch(getFacts())
    }

    // useEffect(() => {
    //     if (!isLoadedList) fetchFactCategories()
    // }, [isLoadedList])

    useEffect(() => {
        if (currentUser && !isFactLoadedList) {
            fetchList()
        }
    }, [currentUser, isFactLoadedList])

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
        const params = Object.keys(createParams(data)).length ? createParams(data) : undefined
        formatDisplayData({ ...queryList, params, page: 1 })
    }

    const onClear = () => {
        reset()
        formatDisplayData(LIST_REQUEST_DEFAULT)
    }

    const deleteFactItem = (id: number) => {
        dispatchAction(dispatch, deleteFact({ id }), t("message.itemIsDeleteSuccessful"))
    }

    const changeStatusItem = (item: IFact) => {
        if (item) {
            const successMessage = item.enabled
                ? "message.itemIsDisableSuccessful"
                : "message.itemIsEnableSuccessful"
            dispatchAction(
                dispatch,
                changeStatusFact({ id: item.id, enabled: !item.enabled }),
                t(successMessage),
            )
        }
    }

    const onDelete = (id: number) => {
        showConfirmation(t("swal.confirmTitle"), t("swal.confirmDeleteText"), () =>
            deleteFactItem(id),
        )
    }

    const onChangeStatus = (item: IFact) => {
        const confirmText = item.enabled ? "swal.confirmDisableText" : "swal.confirmEnableText"
        showConfirmation(t("swal.confirmTitle"), t(confirmText), () => changeStatusItem(item))
    }

    return (
        <div>
            <PageHeading
                title={t("fact.fact")}
                permissionActions={actions}
                pageActions={[ACTIONS.create]}
                currentPathname={pathname}
            />
            <Box sx={{ marginBottom: "10px", fontSize: "16px" }}>
                <form id="client-form" onSubmit={handleSubmit(onSearch)} action="">
                    <Grid container spacing={2} sx={{ marginBottom: "5px" }}>
                        <Grid item xs={4}>
                            <SelectField
                                options={FACT_TYPE_OPTIONS}
                                defaultValue={""}
                                control={control}
                                name="type"
                                label={t("common.type")}
                                isAllOption={true}
                            />
                        </Grid>
                        {/* <Grid item xs={4}>
                            <SelectField
                                options={factCategoryOptions}
                                defaultValue={""}
                                control={control}
                                name="categoryId"
                                label={t("fact.categoryName")}
                                isAllOption={true}
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
                data={displayItems}
                actions={actions}
                changeStatus={onChangeStatus}
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

export default Facts
