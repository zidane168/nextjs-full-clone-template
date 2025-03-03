"use client"

import { selectAuthUser } from "@/redux/features/auth/reducer"
import {
    changeStatusMember,
    getMembers,
    selectIsLoadList,
    selectMemberPaginations,
    selectMembers,
} from "@/redux/features/member/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IHeading, ILayoutParams, IListRequest } from "@/types/common"
import { IMember } from "@/types/member"
import { ACTIONS, LIST_REQUEST_DEFAULT, TABLE_CELL_DATA_TYPE } from "@/utils/constants"
import {
    createParams,
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
import { toast } from "react-toastify"

const Members = ({ params: { locale } }: { params: ILayoutParams }) => {
    const t = useTranslations()
    const [queryList, setQueryList] = useState(LIST_REQUEST_DEFAULT)
    const [actions, setActions] = useState([] as string[])

    const dispatch = useAppDispatch()

    const searchParams = useSearchParams()

    const currentUser = useAppSelector(selectAuthUser)
    const pathname = usePathname()
    const { handleSubmit, reset, control } = useForm()

    const listItems = useAppSelector(selectMembers)
    const paginationData = useAppSelector(selectMemberPaginations)
    const isLoadList = useAppSelector(selectIsLoadList)
    const headings: IHeading[] = [
        { key: "id", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: `title`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "member.title",
        },
        {
            key: `name`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "member.name",
        },
        {
            key: `gender`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "member.gender",
        },
        {
            key: `dob`,
            type: TABLE_CELL_DATA_TYPE.DATE,
            keyLabel: "member.dob",
        },
        {
            key: "phone",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.phone",
        },
        {
            key: "email",
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.email",
        },
        {
            key: "enabled",
            type: TABLE_CELL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const fetchMembers = async (pagination: IListRequest) => {
        const searchParams = formatDataSearch(pagination)
        await dispatch(getMembers(searchParams))
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
        fetchMembers(newQueryList)
    }, [searchParams, isLoadList])

    const onChangePage = (value: number) => {
        fetchMembers({ ...queryList, page: value })
    }

    const onSearch = (data: Record<string, any>) => {
        const params = Object.keys(createParams(data)).length ? createParams(data) : undefined
        fetchMembers({ ...queryList, params, page: 1 })
    }

    const onClear = () => {
        reset()
        fetchMembers(LIST_REQUEST_DEFAULT)
    }

    const dispatchAction = async (action: any, successMessage: string, refetch?: boolean) => {
        const value = await dispatch(action)
        if (!(value as any)?.error) {
            toast.success(successMessage)
            if (refetch) {
                fetchMembers({ ...queryList })
            }
        }
    }

    const changeStatusItem = (item: IMember) => {
        if (item) {
            const successMessage = item.enabled
                ? "message.itemIsDisableSuccessful"
                : "message.itemIsEnableSuccessful"
            dispatchAction(
                changeStatusMember({ id: item.id, enabled: !item.enabled }),
                t(successMessage),
                true,
            )
        }
    }

    const onChangeStatus = (item: IMember) => {
        const confirmText = item.enabled ? "swal.confirmDisableText" : "swal.confirmEnableText"
        showConfirmation(t("swal.confirmTitle"), t(confirmText), () => changeStatusItem(item))
    }

    // const exportMembers = async () => {
    //     const values = getValues()
    //     const plainParams: Record<string, string> = {}

    //     Object.entries(values).forEach(([key, value]) => {
    //         if (value !== undefined && value !== null && value !== "") plainParams[key] = value
    //     })
    //     const value = await dispatch(exportMember(plainParams))
    //     if (!(value as any)?.error) {
    //         window.open((value as any).payload.data.url, "_self")
    //     }
    // }

    return (
        <div>
            <PageHeading
                // pageActions={[ACTIONS.create, ACTIONS.export]}
                pageActions={[ACTIONS.create]}
                title={t("member.member")}
                permissionActions={actions}
                // onExport={exportMembers}
                currentPathname={pathname}
            />
            <Box sx={{ marginBottom: "10px", fontSize: "16px" }}>
                <form id="client-form" onSubmit={handleSubmit(onSearch)} action="">
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <InputField
                                name="phone"
                                control={control}
                                label={t("common.phone")}
                                id="phone"
                            />
                        </Grid>

                        <Grid item xs={3}>
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

                        <Grid item xs={3}>
                            <InputField
                                name="name"
                                control={control}
                                label={t("member.name")}
                                id="name"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <InputField
                                name="email"
                                control={control}
                                label={t("common.email")}
                                id="email"
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
                changeStatus={onChangeStatus}
                // resetPasswordByEmail={onResetPasswordByEmail}
                // resetPasswordByPhone={onResetPasswordByPhone}
            />
            <PagePagination
                totalPage={paginationData.totalPage}
                page={queryList.page}
                setPage={onChangePage}
            />
        </div>
    )
}

export default Members
