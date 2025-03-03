"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import React, { useEffect, useState } from "react"
import { IHeading, ILayoutParams, IListRequest, ISelectOption } from "@/types/common"
import { ACTIONS, BANNER_TYPE, LIST_REQUEST_DEFAULT, TABLE_CELL_DATA_TYPE } from "@/utils/constants"
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
    getBanners,
    selectIsLoadList,
    selectBanners,
    deleteBanner,
    changeStatusBanner,
} from "@/redux/features/banner/reducer"
import { selectAuthUser } from "@/redux/features/auth/reducer"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { IBanner } from "@/types/banner"
import { Box, Grid } from "@mui/material"
import {
    SearchActions,
    InputField,
    RadioGroupField,
    SelectField,
    PageHeading,
    DataTable,
    PagePagination,
} from "@/views/DynamicComponent/DynamicComponent"

const Banners = ({ params: { locale } }: { params: ILayoutParams }) => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const [queryList, setQueryList] = useState(LIST_REQUEST_DEFAULT)
    const [actions, setActions] = useState([] as string[])
    const [displayItems, setDisplayItems] = useState([] as IBanner[])
    const [totalRecords, setTotalRecords] = useState(1)

    const searchParams = useSearchParams()

    const currentUser = useAppSelector(selectAuthUser)
    const isLoadedList = useAppSelector(selectIsLoadList)
    const pathname = usePathname()

    const listItems = useAppSelector(selectBanners)

    const headings: IHeading[] = [
        { key: "id", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.id" },

        {
            key: `name.${locale}`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.name",
        },
        {
            key: `type`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.type",
        },
        {
            key: `url`,
            type: TABLE_CELL_DATA_TYPE.IMAGE,
            keyLabel: "common.url",
        },
        {
            key: "enabled",
            type: TABLE_CELL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const fetchBanners = async () => {
        await dispatch(getBanners())
    }

    useEffect(() => {
        if (currentUser && !isLoadedList) {
            fetchBanners()
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

    const getBannerTypes = () => {
        return Object.entries(BANNER_TYPE).map(([key, value]) => {
            return {
                label: t(`banner.${value}`),
                value: key,
            } as ISelectOption
        })
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

    const deleteBannerItem = (id: number) => {
        dispatchAction(dispatch, deleteBanner({ id }), t("message.itemIsDeleteSuccessful"))
    }

    const changeStatusItem = (item: IBanner) => {
        if (item) {
            const successMessage = item.enabled
                ? "message.itemIsDisableSuccessful"
                : "message.itemIsEnableSuccessful"
            dispatchAction(
                dispatch,
                changeStatusBanner({ id: item.id, enabled: !item.enabled }),
                t(successMessage),
            )
        }
    }

    const onDelete = (id: number) => {
        showConfirmation(t("swal.confirmTitle"), t("swal.confirmDeleteText"), () =>
            deleteBannerItem(id),
        )
    }

    const onChangeStatus = (item: IBanner) => {
        const confirmText = item.enabled ? "swal.confirmDisableText" : "swal.confirmEnableText"
        showConfirmation(t("swal.confirmTitle"), t(confirmText), () => changeStatusItem(item))
    }

    return (
        <div>
            <PageHeading
                title={t("banner.banner")}
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
                                name="title"
                                id="title"
                                label={t("common.name")}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <SelectField
                                control={control}
                                defaultValue=""
                                name="type"
                                label={t("common.type")}
                                options={getBannerTypes()}
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

export default Banners
