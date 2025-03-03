"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import React, { useEffect, useState } from "react"
import { IHeading, ILayoutParams, IListRequest, ISelectOption } from "@/types/common"
import { SETTING_TYPE, LIST_REQUEST_DEFAULT, TABLE_CELL_DATA_TYPE } from "@/utils/constants"
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
import { selectAuthUser } from "@/redux/features/auth/reducer"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { ISetting } from "@/types/setting"
import { Box, Button, ButtonProps, Grid } from "@mui/material"
import {
    SearchActions,
    InputField,
    SelectField,
    PageHeading,
    DataTable,
    PagePagination,
} from "@/views/DynamicComponent/DynamicComponent"
import {
    selectSettings,
    selectIsLoadSettingList,
    getSettings,
} from "@/redux/features/setting/reducer"
import {
    getEShops,
    selectEShops,
    selectIsLoadEShopList,
    updateEShop,
} from "@/redux/features/eShop/reducer"
import { IEShop } from "@/types/eShop"

type ActionButtonProps = {
    action: () => void
    label: string
    icon?: React.ReactNode
    color?: ButtonProps["color"]
}

const Settings = ({ params: { locale } }: { params: ILayoutParams }) => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const [queryList, setQueryList] = useState(LIST_REQUEST_DEFAULT)
    const [actions, setActions] = useState([] as string[])
    const [displayItems, setDisplayItems] = useState([] as ISetting[])
    const [totalRecords, setTotalRecords] = useState(1)

    const searchParams = useSearchParams()

    const currentUser = useAppSelector(selectAuthUser)
    const isLoadedList = useAppSelector(selectIsLoadSettingList)

    const isEShopLoaded = useAppSelector(selectIsLoadEShopList)
    const eShopItem = useAppSelector(selectEShops)
    const pathname = usePathname()

    const listItems = useAppSelector(selectSettings)
    const headings: IHeading[] = [
        { key: "id", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: "key",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "setting.key",
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

    const fetchSettings = async () => {
        await dispatch(getSettings())
    }

    const fetchEShops = async () => {
        await dispatch(getEShops())
    }

    useEffect(() => {
        if (currentUser && !isLoadedList) {
            fetchSettings()
        }
    }, [currentUser, isLoadedList])

    useEffect(() => {
        if (currentUser && !isEShopLoaded) {
            fetchEShops()
        }
    }, [currentUser, isEShopLoaded])

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

    const getSettingTypes = () => {
        return Object.entries(SETTING_TYPE).map(([key, value]) => {
            return {
                label: t(`setting.${value}`),
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

    const changeStatusItem = (item: IEShop) => {
        if (item) {
            const successMessage = item.enabled
                ? "message.itemIsDisableSuccessful"
                : "message.itemIsEnableSuccessful"
            dispatchAction(
                dispatch,
                updateEShop({
                    id: item.id,
                    enabled: !item.enabled,
                }),
                t(successMessage),
            )
        }
    }

    const onChangeStatus = (item: IEShop) => {
        const confirmText = item.enabled ? "swal.confirmDisableText" : "swal.confirmEnableText"
        showConfirmation(t("swal.confirmTitle"), t(confirmText), () => changeStatusItem(item))
    }

    const actionButton = (props: ActionButtonProps) => {
        const { action, label, icon, color } = props

        return (
            <Button
                variant="outlined"
                startIcon={icon ? icon : <></>}
                size="small"
                onClick={() => action()}
                color={color ? color : "primary"}>
                {label}
            </Button>
        )
    }

    const actionButtonProps = [
        {
            action: () => onChangeStatus(eShopItem[0]),
            label: eShopItem[0]?.enabled ? t("message.disableEShop") : t("message.enableEShop"),
            color: eShopItem[0]?.enabled ? "error" : "success",
        },
    ] as ActionButtonProps[]

    const actionButtons = () => {
        return actionButtonProps.map(item => actionButton(item))
    }

    return (
        <div>
            <PageHeading
                title={t("setting.setting")}
                permissionActions={actions}
                currentPathname={pathname}
                actionButton={actionButtons()}
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
                            <SelectField
                                control={control}
                                defaultValue=""
                                name="type"
                                label={t("common.type")}
                                options={getSettingTypes()}
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

export default Settings
