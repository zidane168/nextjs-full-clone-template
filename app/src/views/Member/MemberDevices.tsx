"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import React, { useEffect, useState } from "react"
import { IHeading, IListRequest, ISelectOption } from "@/types/common"
import { LIST_REQUEST_DEFAULT, MEMBER_DEVICE_TYPE, TABLE_CELL_DATA_TYPE } from "@/utils/constants"
import { usePathname, useSearchParams } from "next/navigation"
import {
    createParams,
    formatDataSearch,
    getPermissionActionByPathname,
    getQueryParams,
    pushNewRoute,
} from "@/utils/helpers/common"
import {
    getMemberDevices,
    selectMemberDevicePaginations,
    selectMemberDevices,
} from "@/redux/features/memberDevices/reducer"
import { selectAuthUser } from "@/redux/features/auth/reducer"
import { useTranslations } from "next-intl"
import { Box, Grid } from "@mui/material"
import { useForm } from "react-hook-form"
import {
    SearchActions,
    SelectField,
    InputField,
    PageHeading,
    PagePagination,
    DataTable,
} from "@/views/DynamicComponent/DynamicComponent"

const MemberDevices = () => {
    const t = useTranslations()
    const [queryList, setQueryList] = useState(LIST_REQUEST_DEFAULT)
    const [actions, setActions] = useState([] as string[])
    const dispatch = useAppDispatch()

    const searchParams = useSearchParams()

    const currentUser = useAppSelector(selectAuthUser)
    const pathname = usePathname()

    const listItems = useAppSelector(selectMemberDevices)
    const paginationData = useAppSelector(selectMemberDevicePaginations)

    const headings: IHeading[] = [
        { key: "id", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: "memberId",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "memberDevice.memberId",
        },
        {
            key: "type",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.type",
        },
        {
            key: "model",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "memberDevice.model",
        },
        {
            key: "version",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "memberDevice.version",
        },
        {
            key: `member.firstName`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "memberDevice.member.firstName",
        },
        {
            key: `member.lastName`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "memberDevice.member.lastName",
        },
    ]

    const fetchMemberDevices = async (pagination: IListRequest) => {
        const searchParams = formatDataSearch(pagination)
        await dispatch(getMemberDevices(searchParams))
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
        fetchMemberDevices(newQueryList)
    }, [searchParams])

    const onChangePage = (value: number) => {
        fetchMemberDevices({ ...queryList, page: value })
    }

    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            type: "",
        },
    })

    const onSearch = (data: Record<string, any>) => {
        const params = Object.keys(createParams(data)).length ? createParams(data) : undefined
        fetchMemberDevices({ ...queryList, params, page: 1 })
    }

    const onClear = () => {
        reset()
        fetchMemberDevices(LIST_REQUEST_DEFAULT)
    }

    const getMemberDeviceTypes = () => {
        return Object.entries(MEMBER_DEVICE_TYPE).map(([key, value]) => {
            return {
                label: t(`memberDevice.${value}`),
                value: key,
            } as ISelectOption
        })
    }

    return (
        <div>
            <PageHeading
                title={t("memberDevice.memberDevice")}
                permissionActions={actions}
                currentPathname={pathname}
            />
            <Box sx={{ marginBottom: "10px", fontSize: "16px" }}>
                <form id="client-form" onSubmit={handleSubmit(onSearch)} action="">
                    <Grid container spacing={2} sx={{ marginBottom: "5px" }}>
                        <Grid item md={6} xs={12}>
                            <SelectField
                                control={control}
                                defaultValue=""
                                name="type"
                                isAllOption={true}
                                label={t("common.type")}
                                options={getMemberDeviceTypes()}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <InputField
                                name="memberId"
                                control={control}
                                label={t("memberDevice.memberId")}
                                id={"memberId"}
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
            />
            <PagePagination
                totalPage={paginationData.totalPage}
                page={queryList.page}
                setPage={onChangePage}
            />
        </div>
    )
}

export default MemberDevices
