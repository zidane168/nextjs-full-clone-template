"use client"

import { selectAuthUser } from "@/redux/features/auth/reducer"
import {
    getContactInfos,
    selectContactInfos,
    selectIsContactInfoLoadList,
} from "@/redux/features/contactInfo/reducer"
import { changeStatusFact, deleteFact } from "@/redux/features/fact/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IHeading, ILayoutParams, IListRequest } from "@/types/common"
import { IContactInfo } from "@/types/contactInfo"
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
import { DataTable, PageHeading, PagePagination } from "@/views/DynamicComponent/DynamicComponent"
import { Box } from "@mui/material"
import { useTranslations } from "next-intl"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const ContactInfos = ({ params: { locale } }: { params: ILayoutParams }) => {
    const t = useTranslations()
    const dispatch = useAppDispatch()

    const isLoadedList = useAppSelector(selectIsContactInfoLoadList)
    const [queryList, setQueryList] = useState(LIST_REQUEST_DEFAULT)
    const [actions, setActions] = useState([] as string[])
    const [displayItems, setDisplayItems] = useState([] as IContactInfo[])
    const [totalRecords, setTotalRecords] = useState(1)

    const searchParams = useSearchParams()

    const currentUser = useAppSelector(selectAuthUser)

    const pathname = usePathname()

    const listItems = useAppSelector(selectContactInfos)

    const headings: IHeading[] = [
        { key: "id", type: TABLE_CELL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: `name.${locale}`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.name",
        },
        {
            key: `email`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.email",
        },
        {
            key: `fax`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "contactInfo.fax",
        },
        {
            key: `whatsapp`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "contactInfo.whatsapp",
        },
        {
            key: `phone`,
            type: TABLE_CELL_DATA_TYPE.TEXT,
            keyLabel: "common.phone",
        },
        {
            key: `coverImage`,
            type: TABLE_CELL_DATA_TYPE.IMAGE,
            keyLabel: "common.coverImage",
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
        await dispatch(getContactInfos())
    }

    useEffect(() => {
        if (currentUser && !isLoadedList) {
            fetchList()
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

    // const onSearch = (data: Record<string, any>) => {
    //     const params = Object.keys(createParams(data)).length ? createParams(data) : undefined
    //     formatDisplayData({ ...queryList, params, page: 1 })
    // }

    // const onClear = () => {
    //     reset()
    //     formatDisplayData(LIST_REQUEST_DEFAULT)
    // }

    const deleteFactItem = (id: number) => {
        dispatchAction(dispatch, deleteFact({ id }), t("message.itemIsDeleteSuccessful"))
    }

    const changeStatusItem = (item: IContactInfo) => {
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

    const onChangeStatus = (item: IContactInfo) => {
        const confirmText = item.enabled ? "swal.confirmDisableText" : "swal.confirmEnableText"
        showConfirmation(t("swal.confirmTitle"), t(confirmText), () => changeStatusItem(item))
    }

    return (
        <div>
            <PageHeading
                title={t("contactInfo.contactInfo")}
                permissionActions={actions}
                pageActions={[ACTIONS.create]}
                currentPathname={pathname}
            />
            <Box sx={{ marginBottom: "10px", fontSize: "16px" }}></Box>
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

export default ContactInfos
