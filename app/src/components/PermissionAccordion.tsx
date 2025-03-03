import React, { useEffect, useMemo, useState, useCallback } from "react"
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Checkbox,
    Grid,
    Paper,
    TableContainer,
    Typography,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
} from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form"
import { IPermissionSub } from "@/types/user"
import { IPermission } from "@/types/permission"

interface AccordionTableProps {
    permissions: Permission[]
    selectedPermissionsId?: string[]
}
interface Permission {
    id: number
    title: string
    action: string
}

export const AccordionTable: React.FC<AccordionTableProps> = ({ permissions }) => {
    const [selectedId, setSelectedId] = useState<string[]>([])
    const { register, setValue, getValues } = useFormContext()

    const modulePermissionsId = useMemo(
        () => permissions.map(item => item.id.toString()),
        [permissions],
    )

    const handleSelect = () => {
        const formPermissions = getValues("permissions")
        setSelectedId(formPermissions)
    }

    const handleSelectAllClick = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const formPermissions = getValues("permissions")
            const { checked } = event.target
            const newSelected = checked ? modulePermissionsId : []
            const newPermissions = checked
                ? [...new Set([...formPermissions, ...modulePermissionsId])]
                : formPermissions.filter((item: string) => !modulePermissionsId.includes(item))

            setSelectedId(newSelected)
            setValue("permissions", newPermissions, { shouldDirty: true })
        },
        [modulePermissionsId, getValues, setValue],
    )

    const handleClick = useCallback(
        (id: string) => {
            const formPermissions = getValues("permissions")
            const newPermissions = formPermissions.includes(id)
                ? formPermissions.filter((item: string) => item !== id)
                : [...formPermissions, id]

            setValue("permissions", newPermissions, { shouldDirty: true })
            setSelectedId(newPermissions)
        },
        [getValues, setValue],
    )

    const compareArray = useCallback(() => {
        const formPermissions = getValues("permissions")
        const selectedSet = new Set(formPermissions)
        return modulePermissionsId.every(permissionId => selectedSet.has(permissionId))
    }, [modulePermissionsId, getValues])

    const firstRenderEditState = useCallback(() => {
        const selectedPermissionsId = getValues("permissions")?.map(String) ?? []
        setSelectedId(selectedPermissionsId)
    }, [getValues])

    useEffect(() => {
        firstRenderEditState()
    }, [permissions, firstRenderEditState])

    return (
        <TableContainer component={Paper}>
            <Table aria-label="permissions table">
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                checked={compareArray()}
                                onChange={handleSelectAllClick}
                                id={permissions[0]?.id.toString()}
                            />
                        </TableCell>
                        {permissions?.map((item, itemIndex) => (
                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: "bold",
                                    textTransform: "capitalize",
                                    padding: "0px",
                                }}
                                key={itemIndex}>
                                {Object.keys(item)[itemIndex]}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {permissions?.map((permission: Permission, permissionIndex) => {
                        const labelId = `permissions-table-checkbox-${permission.id}`
                        return (
                            <TableRow
                                hover
                                onClick={() => handleClick(permission.id.toString())}
                                sx={{ cursor: "pointer" }}
                                tabIndex={-1}
                                key={permissionIndex + permission.id}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedId.includes(permission.id.toString())}
                                        value={permission.id}
                                        inputProps={{
                                            "aria-labelledby": labelId,
                                        }}
                                        {...register(`permissions`, {
                                            onChange: () => handleSelect(),
                                        })}
                                    />
                                </TableCell>
                                <TableCell align="center">{permission.id}</TableCell>
                                <TableCell align="center" id={labelId}>
                                    {permission.title}
                                </TableCell>
                                <TableCell align="center">{permission.action}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

interface PermissionAccordionProps {
    data: IPermission[]
    rolePermissions?: IPermissionSub[]
}

interface GroupedPermission {
    subject: string
    subjectPermission: SubjectPermission[]
}

interface SubjectPermission {
    id: number
    title: string
    action: string
}

export default function PermissionAccordion({ ...props }: PermissionAccordionProps) {
    const t = useTranslations()
    const [permissions, setPermissions] = useState<GroupedPermission[]>([])
    const [expandedAccordions, setExpandedAccordions] = useState<number[]>([])
    const [selectedId, setSelectedId] = useState<string[]>([])
    const { data, rolePermissions } = props

    const groupBySubjectToArray = useCallback((permissions: IPermission[]): GroupedPermission[] => {
        const groups = permissions.reduce(
            (acc: { [subject: string]: GroupedPermission }, curr: IPermission) => {
                const { id, title, action, subject } = curr
                if (!acc[subject]) {
                    acc[subject] = { subject, subjectPermission: [] }
                }
                acc[subject].subjectPermission.push({ id, title, action })
                return acc
            },
            {},
        )
        return Object.values(groups)
    }, [])

    const accordionClicked = useCallback(
        (index: number) => {
            const isExpanded = expandedAccordions.includes(index)
            const newExpandedAccordions = isExpanded
                ? expandedAccordions.filter(number => number !== index)
                : [...expandedAccordions, index]
            setExpandedAccordions(newExpandedAccordions)
        },
        [expandedAccordions],
    )

    const collapseAll = useCallback(() => {
        setExpandedAccordions([])
    }, [])

    const expandAll = useCallback(() => {
        const newArray = permissions?.map((item, itemIndex) => itemIndex) || []
        setExpandedAccordions(newArray)
    }, [permissions])

    const firstRenderEditState = useCallback(
        (data: GroupedPermission[]) => {
            const selectedPermissionsId =
                rolePermissions?.map(permission => permission.id.toString()) || []
            setSelectedId(selectedPermissionsId)

            const expandedAccordions = data.reduce(
                (acc: number[], item: GroupedPermission, itemIndex: number) => {
                    const hasSelectedPermission = item.subjectPermission.some(permission =>
                        selectedPermissionsId.includes(permission.id.toString()),
                    )
                    if (hasSelectedPermission) {
                        acc.push(itemIndex)
                    }
                    return acc
                },
                [],
            )
            setExpandedAccordions(expandedAccordions)
        },
        [rolePermissions],
    )

    useEffect(() => {
        const groupedPermissions = groupBySubjectToArray(data)
        setPermissions(groupedPermissions)
        firstRenderEditState(groupedPermissions)
    }, [data, rolePermissions, groupBySubjectToArray, firstRenderEditState])

    return (
        <Box width={"100%"}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                        <Button
                            size="small"
                            variant="text"
                            sx={{ marginRight: "15px" }}
                            onClick={collapseAll}
                            startIcon={<ExpandLess />}>
                            {t("common.collapse")}
                        </Button>
                        <Button
                            size="small"
                            variant="text"
                            onClick={expandAll}
                            color="success"
                            startIcon={<ExpandMore />}>
                            {t("common.expand")}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                {permissions.map((item: GroupedPermission, itemIndex) => (
                    <Grid md={6} xs={12} item key={itemIndex + item.subject}>
                        <Accordion
                            onChange={() => accordionClicked(itemIndex)}
                            expanded={expandedAccordions.includes(itemIndex)}>
                            <AccordionSummary
                                expandIcon={<KeyboardArrowDownIcon />}
                                aria-controls="panel1a-content">
                                <Typography>{item.subject}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <AccordionTable
                                    permissions={item.subjectPermission}
                                    selectedPermissionsId={selectedId}
                                />
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}
