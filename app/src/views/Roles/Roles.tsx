"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import React, { useEffect, useState } from "react"
import { IHeading, ILayoutParams, IListRequest } from "@/types/common"
import { ACTIONS, LIST_REQUEST_DEFAULT, TABLE_CELL_DATA_TYPE } from "@/utils/constants"
import { usePathname, useSearchParams } from "next/navigation"
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
    changeStatusRole,
    deleteRole,
    getRoles,
    selectIsLoadList,
    selectRoles,
} from "@/redux/features/role/reducer"
import { selectAuthUser } from "@/redux/features/auth/reducer"
import { useTranslations } from "next-intl"
import { Box, Grid } from "@mui/material"
import { useForm } from "react-hook-form"
import { IRole } from "@/types/role"
import {
    SearchActions,
    InputField,
    RadioGroupField,
    PageHeading,
    DataTable,
    PagePagination,
} from "@/views/DynamicComponent/DynamicComponent"

const Roles = ({ params: { locale } }: { params: ILayoutParams }) => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const [queryList, setQueryList] = useState(LIST_REQUEST_DEFAULT)
    const [actions, setActions] = useState([] as string[])
    const [displayItems, setDisplayItems] = useState([] as IRole[])
    const [totalRecords, setTotalRecords] = useState(1)

    const searchParams = useSearchParams()

    const currentUser = useAppSelector(selectAuthUser)
    const isLoadedList = useAppSelector(selectIsLoadList)
    const pathname = usePathname()

    const listItems = useAppSelector(selectRoles)
    const headings: IHeading[] = [
        { key: "id", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: "title",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.title",
        },
        {
            key: "updatedAt",
            type: TABLE_CELL_DATA_TYPE.DATETIME,
            keyLabel: "common.updatedAt",
        },
        {
            key: "enabled",
            type: TABLE_CELL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const fetchRoles = async () => {
        await dispatch(getRoles())
    }

    useEffect(() => {
        if (currentUser && !isLoadedList) {
            fetchRoles()
        }
    }, [currentUser, isLoadedList])

    const { control, handleSubmit, reset } = useForm()

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

    const deleteRoleItem = (id: number) => {
        dispatchAction(dispatch, deleteRole({ id }), t("message.itemIsDeleteSuccessful"))
    }

    const changeStatusItem = (item: IRole) => {
        if (item) {
            const successMessage = item.enabled
                ? "message.itemIsDisableSuccessful"
                : "message.itemIsEnableSuccessful"
            dispatchAction(
                dispatch,
                changeStatusRole({ id: item.id, enabled: !item.enabled }),
                t(successMessage),
            )
        }
    }

    const onDelete = (id: number) => {
        showConfirmation(t("swal.confirmTitle"), t("swal.confirmDeleteText"), () =>
            deleteRoleItem(id),
        )
    }

    const onChangeStatus = (item: IRole) => {
        const confirmText = item.enabled ? "swal.confirmDisableText" : "swal.confirmEnableText"
        showConfirmation(t("swal.confirmTitle"), t(confirmText), () => changeStatusItem(item))
    }

    return (
        <div>
            <PageHeading
                title={t("role.role")}
                permissionActions={actions}
                pageActions={[ACTIONS.create]}
                currentPathname={pathname}
            />
            <Box sx={{ marginBottom: "10px", fontSize: "16px" }}>
                <form id="client-form" onSubmit={handleSubmit(onSearch)} action="">
                    <Grid container spacing={2} sx={{ marginBottom: "5px" }}>
                        <Grid item xs={6}>
                            <InputField
                                control={control}
                                name="title"
                                id="title"
                                label={t("common.title")}
                            />
                        </Grid>
                        <Grid item xs={6}>
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

export default Roles
