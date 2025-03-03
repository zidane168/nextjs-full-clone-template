import { IDetailField } from "@/types/common"
import { DETAIL_DATA_TYPE, TABLE_CELL_DATA_TYPE, WEBSITE_LANGUAGES } from "@/utils/constants"
import { Box, Table, TableBody, TableCell, TableRow } from "@mui/material"
import { useTranslations } from "next-intl"
import React from "react"
import useStyles from "./index.styles"
import {
    currencyFormat,
    formatDateServerToLocal,
    formatDateTimeServerToLocal,
    formatGender,
    formatTimeServerToLocal,
    getValue,
    imageLoader,
} from "@/utils/helpers/common"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import Image from "next/image"
import DOMPurify from "dompurify"

interface IDetailContent {
    data: any
    fields: IDetailField[]
}

const DetailContent = ({ ...props }: IDetailContent) => {
    const t = useTranslations()
    const { classes } = useStyles()
    const { data, fields } = props

    const isHTML = (str: string): boolean => {
        const htmlRegex = /<[^>]*>/
        return htmlRegex.test(str)
    }

    const formatCell = (type: TABLE_CELL_DATA_TYPE, value: string) => {
        switch (type) {
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
                return <>{value ? formatDateServerToLocal(value) : ""}</>
            case TABLE_CELL_DATA_TYPE.DATETIME:
                return <>{value ? formatDateTimeServerToLocal(value) : ""}</>
            case TABLE_CELL_DATA_TYPE.TIME:
                return <>{value ? formatTimeServerToLocal(value) : ""}</>
            case TABLE_CELL_DATA_TYPE.CURRENCY:
                return <>{value ? currencyFormat(value) : ""}</>
            case TABLE_CELL_DATA_TYPE.GENDER:
                return <>{value ? formatGender(value.toString()) : ""}</>

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
                                height={240}
                                width={240}
                                src={value}
                                alt={value ?? ""}
                                style={{ objectFit: "cover", borderRadius: "8px" }}
                                loading="lazy"
                            />
                        )}
                    </Box>
                )
            default:
                return <></>
        }
    }

    const renderCell = (item: any, field: IDetailField) => {
        const fieldData = getValue(field.key, item)
        switch (field.type) {
            case DETAIL_DATA_TYPE.TEXT:
            case DETAIL_DATA_TYPE.BOOLEAN:
            case DETAIL_DATA_TYPE.CURRENCY:
            case DETAIL_DATA_TYPE.DATETIME:
            case DETAIL_DATA_TYPE.DATE:
            case DETAIL_DATA_TYPE.IMAGE:
            case DETAIL_DATA_TYPE.GENDER:
                return (
                    <Box className={classes.bodyCell}>
                        {formatCell(field.type as unknown as TABLE_CELL_DATA_TYPE, fieldData)}
                    </Box>
                )
            case DETAIL_DATA_TYPE.ARRAY:
                return (
                    <Box className={classes.bodyCell}>
                        {Array.isArray(fieldData) ? fieldData.join(", ") : ""}
                    </Box>
                )
            case DETAIL_DATA_TYPE.PHONE:
                return (
                    <a
                        style={{
                            color: "blue",
                        }}
                        target="_blank"
                        href={`tel:+${fieldData}`}>
                        {fieldData}
                    </a>
                )
            case DETAIL_DATA_TYPE.LINK:
                return (
                    <a
                        style={{
                            color: "blue",
                        }}
                        target="_blank"
                        href={fieldData}>
                        {fieldData}
                    </a>
                )
            case DETAIL_DATA_TYPE.MULTI_LANGUAGES:
                return (
                    <Table>
                        <TableBody>
                            {WEBSITE_LANGUAGES.map((lang: string) => {
                                return (
                                    <TableRow key={lang}>
                                        <TableCell sx={{ padding: "4px" }}>
                                            <Box className={classes.bodyCell}>
                                                {t(`language.${lang}`)}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ padding: "4px" }}>
                                            <Box className={classes.bodyCell}>
                                                {isHTML(getValue(`${field.key}.${lang}`, item))
                                                    ? formatCell(
                                                          TABLE_CELL_DATA_TYPE.HTML,
                                                          getValue(`${field.key}.${lang}`, item),
                                                      )
                                                    : formatCell(
                                                          TABLE_CELL_DATA_TYPE.TEXT,
                                                          getValue(`${field.key}.${lang}`, item),
                                                      )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                )
        }
    }

    const renderRow = (item: any, field: IDetailField, index: number) => {
        return (
            <TableRow className={index % 2 === 0 ? classes.evenRow : classes.oddRow} key={index}>
                <TableCell className={classes.rowFirstCell}>
                    <Box className={classes.bodyCell} sx={{ fontWeight: "bold" }}>
                        {t(field.keyLabel)}
                    </Box>
                </TableCell>
                <TableCell>{renderCell(item, field)}</TableCell>
            </TableRow>
        )
    }

    return (
        <Box width={"100%"} marginBottom={"20px"}>
            <Table>
                <TableBody sx={{ border: "1px solid #ddd", borderBottom: "none" }}>
                    {fields.map((field: IDetailField, itemIndex) =>
                        renderRow(data, field, itemIndex),
                    )}
                </TableBody>
            </Table>
        </Box>
    )
}

export default DetailContent
