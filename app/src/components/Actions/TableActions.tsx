import React from "react"
import { Box, Button, Tooltip } from "@mui/material"
import { useTranslations } from "next-intl"
import {
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Receipt as ReceiptIcon,
    PublishedWithChanges as PublishedWithChangesIcon,
} from "@mui/icons-material"

interface ITableActionProps {
    onViewDetail: () => void
    allowEdit: boolean
    onEdit: () => void
    allowDelete: boolean
    onDelete: () => void
    allowChangeStatus: boolean
    onChangeStatus?: () => void
    allowResetPassword: boolean
    onResetPasswordByEmail: () => void
    onResetPasswordByPhone: () => void
    isEnabled: boolean
    isHaveEmail: string | boolean
    isHavePhone: string | boolean
    allowChangeStatusInvoice: boolean
    onChangeStatusInvoice?: () => void
    allowChangeUsedMemberItem: boolean
    onChangeUsedMemberItem?: () => void
}

const buttonCss = {
    padding: "1px",
    minWidth: "36px",
    margin: "2px 2px",
}

interface ActionButtonProps {
    title: string
    color: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
    onClick: (() => void) | undefined
    icon: React.ReactNode
    [x: string]: any
}

const ActionButton: React.FC<ActionButtonProps> = ({
    title,
    color,
    onClick,
    icon,
    disabled = false,
    ...props
}) => {
    const t = useTranslations("common")
    return (
        <Tooltip title={t(title)}>
            <Button
                variant="outlined"
                size="small"
                color={color}
                onClick={onClick}
                sx={buttonCss}
                disabled={disabled}
                {...props}>
                {icon}
            </Button>
        </Tooltip>
    )
}

const TableActions: React.FC<ITableActionProps> = props => {
    const {
        onViewDetail,
        allowEdit,
        onEdit,
        allowDelete,
        onDelete,
        allowChangeStatus,
        onChangeStatus,
        allowResetPassword,
        onResetPasswordByEmail,
        onResetPasswordByPhone,
        isEnabled,
        isHaveEmail,
        isHavePhone,
        allowChangeStatusInvoice,
        onChangeStatusInvoice,
        allowChangeUsedMemberItem,
        onChangeUsedMemberItem,
    } = props

    return (
        <Box sx={{ padding: "8px 5px" }}>
            <ActionButton
                title="view"
                color="info"
                onClick={onViewDetail}
                icon={<VisibilityIcon fontSize="small" />}
            />
            {allowEdit && (
                <ActionButton
                    title="edit"
                    color="secondary"
                    onClick={onEdit}
                    icon={<EditIcon fontSize="small" />}
                />
            )}
            {/* {allowDelete && (
                <ActionButton
                    title="delete"
                    color="error"
                    onClick={onDelete}
                    icon={<DeleteIcon fontSize="small" />}
                />
            )} */}
            {/* {allowChangeStatus && (
                <ActionButton
                    title={isEnabled ? "disable" : "enable"}
                    color={isEnabled ? "warning" : "success"}
                    onClick={onChangeStatus}
                    // disabled={typeof isEnabled !== "boolean"}
                    icon={
                        isEnabled ? <CloseIcon fontSize="small" /> : <CheckIcon fontSize="small" />
                    }
                />
            )} */}
            {allowResetPassword && isHaveEmail && (
                <ActionButton
                    title="resetPasswordByEmail"
                    color="warning"
                    onClick={onResetPasswordByEmail}
                    icon={<EmailIcon fontSize="small" />}
                />
            )}
            {allowResetPassword && isHavePhone && (
                <ActionButton
                    title="resetPasswordByPhone"
                    color="warning"
                    onClick={onResetPasswordByPhone}
                    icon={<PhoneIcon fontSize="small" />}
                />
            )}
            {allowChangeStatusInvoice && (
                <ActionButton
                    title="changeStatus"
                    color="warning"
                    onClick={onChangeStatusInvoice}
                    icon={<ReceiptIcon fontSize="small" />}
                />
            )}
            {allowChangeUsedMemberItem && (
                <ActionButton
                    title="changeUsed"
                    color="warning"
                    onClick={onChangeUsedMemberItem}
                    icon={<PublishedWithChangesIcon fontSize="small" />}
                />
            )}
        </Box>
    )
}

export default TableActions
