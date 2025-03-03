import React from "react"
import { Control, useController } from "react-hook-form"
import { TextFieldVariants } from "@mui/material"
import { TimePicker } from "@mui/x-date-pickers"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"

export interface InputProps {
    name: string
    control: Control<any>
    label: string
    variant?: TextFieldVariants
    formatString?: string
    disabled?: boolean
}

const TimePickerField = (props: InputProps) => {
    const {
        name,
        control,
        label,
        variant = "outlined",
        disabled = false,
        formatString = "hh:mm a",
    } = props

    const {
        field: { value, onChange, ref },
        fieldState: { invalid, error },
    } = useController({ name, control })
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
                format={formatString}
                label={label}
                onChange={date => {
                    const formattedDate = dayjs(date).format(formatString)
                    onChange(formattedDate)
                }}
                onAccept={date => {
                    const formattedDate = dayjs(date).format(formatString)
                    onChange(formattedDate)
                }}
                value={dayjs(value, formatString)}
                inputRef={ref}
                disabled={disabled}
                slotProps={{
                    textField: {
                        name: name,
                        variant: variant,
                        error: invalid,
                        helperText: error?.message ?? " ",
                    },
                }}
            />
        </LocalizationProvider>
    )
}

export default TimePickerField
