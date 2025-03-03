import { DATE_ONLY_FORMAT } from "@/utils/constants"
import { TextFieldVariants } from "@mui/material"
import { DatePicker, DatePickerProps, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs, { Dayjs } from "dayjs"
import { Control, useController } from "react-hook-form"

// export interface InputProps {
//     name: string
//     control: Control<any>
//     label: string
//     variant?: TextFieldVariants
//     disabled?: boolean
//     defaultValue?: any
//     openTo?: "year" | "month" | "day"
//     views?: Array<"year" | "month" | "day">
//     format?: string
//     disablePast?: boolean
// }
export interface DatePickerCustomprops extends DatePickerProps<Dayjs> {
    variant?: TextFieldVariants
    control: Control<any>
    name: string
}

const DatePickerField = (props: DatePickerCustomprops) => {
    const {
        name,
        control,
        label,
        variant = "outlined",
        disabled = false,
        defaultValue,
        openTo,
        views,
        format,
        disablePast = false,
    } = props

    const {
        field: { value, onChange, ref },
        fieldState: { invalid, error },
    } = useController({
        name,
        control,
        defaultValue: defaultValue ?? null,
    })

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                format={!format ? DATE_ONLY_FORMAT : format}
                label={label}
                onChange={onChange}
                openTo={openTo}
                views={views}
                defaultValue={defaultValue}
                onAccept={onChange}
                value={dayjs(value)}
                inputRef={ref}
                disabled={disabled}
                slotProps={{
                    textField: {
                        variant: variant,
                        error: invalid,
                        helperText: error?.message ?? " ",
                    },
                }}
                {...props}
            />
        </LocalizationProvider>
    )
}

export default DatePickerField
