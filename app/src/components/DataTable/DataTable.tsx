import { IHeading } from "@/types/common"
import {
    ACTIONS,
    ACTION_PATH,
    FOOD_INVOICE_STATUS,
    TABLE_CELL_DATA_TYPE,
    WEBSITE_LANGUAGES,
} from "@/utils/constants"
import {
    currencyFormat,
    formatDateServerToLocal,
    formatDateTimeServerToLocal,
    formatTimeServerToLocal,
    getValue,
    imageLoader,
} from "@/utils/helpers/common"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import {
    Box,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material"
import DOMPurify from "dompurify"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useRouter } from "next/navigation"
import TableActions from "../Actions/TableActions"
import useStyles from "./DataTable.styles"

interface TableProps {
    currentPathName?: string
    headings: Array<IHeading>
    data: any[]
    onlyView?: boolean
    isEditItem?: boolean
    actions?: Array<string>
    deleteItem?: Function
    changeStatus?: Function
    resetPasswordByEmail?: Function
    resetPasswordByPhone?: Function
    changeStatusInvoice?: Function
    changeUsedMemberItem?: Function
    locale?: string
    subHeadings?: Array<IHeading>
    subData?: any[]
    nestedSubHeadings?: Array<IHeading>
    nestedSubDataName?: any
}

const DataTable = ({ ...props }: TableProps) => {
    const t = useTranslations()
    const { classes } = useStyles()
    const router = useRouter()
    const {
        currentPathName,
        headings,
        data,
        onlyView = false,
        isEditItem = true,
        actions = [],
        deleteItem,
        changeStatus,
        resetPasswordByEmail,
        resetPasswordByPhone,
        changeStatusInvoice,
        changeUsedMemberItem,
        locale = WEBSITE_LANGUAGES[0],
        subHeadings,
        subData,
        nestedSubHeadings,
        nestedSubDataName,
    } = props

    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    const allowEdit = actions.includes(ACTIONS.edit) && isEditItem
    const allowDelete = actions.includes(ACTIONS.delete) && !!deleteItem
    const allowChangeStatus = actions.includes(ACTIONS.manage) && !!changeStatus
    const allowResetPassword = !!resetPasswordByEmail || !!resetPasswordByPhone
    const allowchangeStatusInvoice = actions.includes(ACTIONS.manage) && !!changeStatusInvoice
    const allowChangeUsedMemberItem = actions.includes(ACTIONS.manage) && !!changeUsedMemberItem

    const renderTableHeading = () => {
        return headings?.map((heading, index) => (
            <TableCell key={index} sx={{ padding: "0px", background: "#9A7F56" }}>
                <Box className={classes.headerCell}>{t(heading.keyLabel)}</Box>
            </TableCell>
        ))
    }

    const renderTableRow = (item: any, rowIndex: number) => {
        return headings.map((heading, columnIndex) => (
            <TableCell key={`${rowIndex}${columnIndex}`} sx={{ padding: "0px" }}>
                <Box className={classes.bodyCell}>{formatCell(heading, item)}</Box>
            </TableCell>
        ))
    }

    const renderSubTableHeading = () => {
        return subHeadings?.map((heading, index) => (
            <TableCell key={index} sx={{ padding: "0px", background: "#9A7F56" }}>
                <Box className={classes.headerCell}>{t(heading.keyLabel)}</Box>
            </TableCell>
        ))
    }

    const renderSubTableRow = (item: any, rowIndex: number) => {
        return subHeadings?.map((heading, columnIndex) => (
            <TableCell key={`${rowIndex}${columnIndex}`} sx={{ padding: "0px" }}>
                <Box className={classes.bodyCell}>{formatCell(heading, item, rowIndex)}</Box>
            </TableCell>
        ))
    }

    const renderNestedSubTableHeading = () => {
        return nestedSubHeadings?.map((heading, index) => (
            <TableCell key={index} sx={{ padding: "0px", background: "#9A7F56" }}>
                <Box className={classes.headerCell}>{t(heading.keyLabel)}</Box>
            </TableCell>
        ))
    }

    const renderNestedSubTableRow = (item: any, rowIndex: number) => {
        return nestedSubHeadings?.map((heading, columnIndex) => (
            <TableCell key={`${rowIndex}${columnIndex}`} sx={{ padding: "0px" }}>
                <Box className={classes.bodyCell}>{formatCell(heading, item)}</Box>
            </TableCell>
        ))
    }

    const formatCell = (heading: IHeading, item: any, subDataIndex?: number) => {
        let value = ""
        if (heading.type === TABLE_CELL_DATA_TYPE.LIST_LANGUAGES) {
            const language = (item?.languages || []).find((lang: any) => lang?.alias === locale)
            value = language?.[heading.key] || ""
        } else {
            value = getValue(heading.key, item)
        }

        switch (heading.type) {
            case TABLE_CELL_DATA_TYPE.LIST_LANGUAGES:
            case TABLE_CELL_DATA_TYPE.TEXT:
                return typeof value !== "boolean" ? (
                    value
                ) : value ? (
                    <CheckIcon color="success" />
                ) : (
                    <CloseIcon color="warning" />
                )
            case TABLE_CELL_DATA_TYPE.HTML: {
                const sanitizedHTML = DOMPurify.sanitize(value)
                return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
            }
            case TABLE_CELL_DATA_TYPE.DATE:
                return <>{formatDateServerToLocal(value)}</>
            case TABLE_CELL_DATA_TYPE.DATETIME:
                return <>{formatDateTimeServerToLocal(value)}</>
            case TABLE_CELL_DATA_TYPE.TIME:
                return <>{formatTimeServerToLocal(value)}</>
            case TABLE_CELL_DATA_TYPE.CURRENCY:
                return <>{currencyFormat(value)}</>
            case TABLE_CELL_DATA_TYPE.MONTH:
                return <>{t(`month.${value}`)}</>
            case TABLE_CELL_DATA_TYPE.STATUS:
                return typeof value !== "boolean" ? (
                    <></>
                ) : value ? (
                    <Chip label="Earned" color="success" variant="outlined" />
                ) : (
                    <Chip label="Pending" color="warning" variant="outlined" />
                )
            case TABLE_CELL_DATA_TYPE.BOOLEAN:
                return typeof value !== "boolean" ? (
                    <></>
                ) : value ? (
                    <CheckIcon color="success" />
                ) : (
                    <CloseIcon color="warning" />
                )
            case TABLE_CELL_DATA_TYPE.IMAGE:
                return (
                    <Box style={{ padding: "5px", width: "110px" }}>
                        {value && (
                            <Image
                                loader={imageLoader}
                                height={100}
                                width={100}
                                style={{ objectFit: "cover", borderRadius: "8px" }}
                                src={value}
                                alt={item?.id ?? ""}
                                loading="lazy"
                            />
                        )}
                    </Box>
                )
            case TABLE_CELL_DATA_TYPE.TABLE: {
                return (
                    <Table>
                        <TableHead>
                            <TableRow>{renderSubTableHeading()}</TableRow>
                        </TableHead>
                        <TableBody>
                            {subData?.map((item: any, itemIndex) => (
                                <TableRow
                                    className={
                                        itemIndex % 2 === 0 ? classes.evenRow : classes.oddRow
                                    }
                                    key={item.id + itemIndex}>
                                    {renderSubTableRow(item, itemIndex)}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )
            }
            case TABLE_CELL_DATA_TYPE.NESTED_TABLE: {
                return (
                    <Table>
                        <TableHead>
                            <TableRow>{renderNestedSubTableHeading()}</TableRow>
                        </TableHead>
                        <TableBody>
                            {nestedSubDataName !== undefined &&
                                subDataIndex !== undefined &&
                                subDataIndex !== null &&
                                subData &&
                                subData[subDataIndex] &&
                                subData[subDataIndex][nestedSubDataName]?.map(
                                    (nestedItem: any, nestedItemIndex: number) => {
                                        return (
                                            <TableRow
                                                className={
                                                    nestedItemIndex % 2 === 0
                                                        ? classes.evenRow
                                                        : classes.oddRow
                                                }
                                                key={nestedItem.id + nestedItemIndex}>
                                                {renderNestedSubTableRow(
                                                    nestedItem,
                                                    nestedItemIndex,
                                                )}
                                            </TableRow>
                                        )
                                    },
                                )}
                        </TableBody>
                    </Table>
                )
            }
            case TABLE_CELL_DATA_TYPE.WEEKDAY:
                return typeof value === "number" && value >= 0 && value <= 6 ? (
                    <>{weekdays[value]}</>
                ) : (
                    <></>
                )
            default:
                return <></>
        }
    }

    const onViewDetail = (id: string) => {
        router.push(`${currentPathName}/${ACTION_PATH.view}/${id}`)
    }

    const onEditItem = (id: string) => {
        router.push(`${currentPathName}/${ACTION_PATH.edit}/${id}`)
    }

    const onDelete = (id: string) => {
        if (deleteItem) {
            deleteItem(id)
        }
    }

    const onChangeStatus = (item: any) => {
        if (changeStatus) {
            changeStatus(item)
        }
    }

    const onResetPasswordByEmail = (email: string) => {
        if (resetPasswordByEmail) {
            resetPasswordByEmail(email)
        }
    }

    const onResetPasswordByPhone = (country: string, phone: string) => {
        if (resetPasswordByPhone) {
            resetPasswordByPhone(country, phone)
        }
    }

    const onchangeStatusInvoice = (item: any) => {
        if (changeStatusInvoice) {
            changeStatusInvoice(item)
        }
    }

    const isStatusChangeable = (status: FOOD_INVOICE_STATUS) => {
        const unchangeableStatuses = [
            "VOID",
            "CANCELLED",
            "NOT_YET_PAID",
            "PAYING",
            "MAKING_FOOD",
            "READY_FOR_PICK_UP",
            "FAILED",
            "CANCELLED",
        ]
        return !unchangeableStatuses.includes(status)
    }

    const onChangeUsedMemberItem = (item: any) => {
        if (changeUsedMemberItem) {
            changeUsedMemberItem(item)
        }
    }

    return (
        <>
            <TableContainer>
                <Table style={{ minWidth: 1575 }}>
                    <TableHead sx={{ backgroundColor: "#ddd" }}>
                        <TableRow>
                            {renderTableHeading()}
                            {!onlyView && (
                                <TableCell
                                    key={headings?.length}
                                    width="130px"
                                    sx={{
                                        padding: "0px",
                                        background: "#9A7F56",
                                        position: "sticky",
                                        right: 0,
                                        zIndex: 10,
                                    }}>
                                    <Box className={classes.headerCell}>{t("common.action")}</Box>
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((item: any, itemIndex: number) => (
                            <TableRow
                                className={itemIndex % 2 === 0 ? classes.evenRow : classes.oddRow}
                                key={item.id ?? itemIndex}>
                                {renderTableRow(item, itemIndex)}
                                {!onlyView && (
                                    <TableCell
                                        key={`${itemIndex}${headings.length}`}
                                        sx={{
                                            padding: "0px",
                                            textAlign: "center",
                                            position: "sticky",
                                            background: itemIndex % 2 === 0 ? "#F1EEEA" : "#F9F6F2",
                                            right: 0,
                                            zIndex: 10,
                                        }}>
                                        <TableActions
                                            onViewDetail={() => onViewDetail(item.id)}
                                            allowEdit={allowEdit}
                                            onEdit={() => onEditItem(item.id)}
                                            allowDelete={allowDelete}
                                            onDelete={() => onDelete(item.id)}
                                            allowChangeStatus={allowChangeStatus}
                                            onChangeStatus={() => onChangeStatus(item)}
                                            allowResetPassword={allowResetPassword}
                                            onResetPasswordByEmail={() =>
                                                onResetPasswordByEmail(item?.email)
                                            }
                                            onResetPasswordByPhone={() =>
                                                onResetPasswordByPhone(item?.country, item?.phone)
                                            }
                                            allowChangeStatusInvoice={
                                                isStatusChangeable(item.status)
                                                    ? allowchangeStatusInvoice
                                                    : false
                                            }
                                            onChangeStatusInvoice={() =>
                                                onchangeStatusInvoice(item)
                                            }
                                            allowChangeUsedMemberItem={
                                                !item?.usedDate ? allowChangeUsedMemberItem : false
                                            }
                                            onChangeUsedMemberItem={() =>
                                                onChangeUsedMemberItem(item)
                                            }
                                            isEnabled={item?.enabled ?? false}
                                            isHaveEmail={item?.email ?? false}
                                            isHavePhone={item?.phone ?? false}
                                        />
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default DataTable
