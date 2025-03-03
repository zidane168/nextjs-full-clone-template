import React from "react"
import TextField from "@mui/material/TextField"
import { Control, useController } from "react-hook-form"
import { InputBaseComponentProps, TextFieldVariants } from "@mui/material"

export interface InputProps {
    name: string
    control?: Control<any>
    label: string
    type?: string
    inputProps?: InputBaseComponentProps
    variant?: TextFieldVariants
    sx?: object
    disabled?: boolean
    multiline?: boolean
    rows?: number
    id?: string
    required?: boolean
}

const InputField = (props: InputProps) => {
    const {
        name,
        control,
        label,
        type = "text",
        variant = "outlined",
        inputProps = {},
        disabled = false,
        sx = {},
        multiline = false,
        rows = 1,
        id = "",
        required = false,
    } = props

    const {
        field: { value, onChange, onBlur, ref },
        fieldState: { invalid, error },
    } = useController({ name, control })

    const modifiedLabel = required ? `${label}*` : label

    return (
        <TextField
            sx={{ ...sx }}
            id={id}
            type={type}
            label={modifiedLabel}
            variant={variant}
            error={invalid}
            value={value !== null && value !== undefined ? (value === 0 ? 0 : value) : ""}
            inputRef={ref}
            disabled={disabled}
            onChange={onChange}
            onBlur={onBlur}
            helperText={error?.message ?? " "}
            inputProps={inputProps}
            multiline={multiline}
            rows={rows}
            autoComplete={type !== "password" ? name : "off"}
        />
    )
}

export default InputField
