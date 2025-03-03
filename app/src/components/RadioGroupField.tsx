import React, { forwardRef } from "react"
import { Control, useController } from "react-hook-form"
import {
    FormHelperText,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
} from "@mui/material"

export interface RadioOption {
    label: string
    value: any
}

export interface RadioGroupFieldProps {
    name: string
    control: Control<any>
    defaultValue?: any
    label: string
    readonly?: boolean
    options: RadioOption[]
    required?: boolean
}

// eslint-disable-next-line react/display-name
const RadioGroupField = forwardRef(
    (
        { name, control, label, options, defaultValue, readonly, required }: RadioGroupFieldProps,
        ref,
    ) => {
        const {
            field: { value = "", onChange },
            fieldState: { invalid, error },
        } = useController({
            name,
            control,
            defaultValue: defaultValue || "",
        })

        const modifiedLabel = required ? `${label}*` : label

        return (
            <FormControl error={invalid}>
                <FormLabel
                    sx={{
                        fontSize: "0.8rem",
                    }}>
                    {modifiedLabel}
                </FormLabel>
                <RadioGroup name={name} row ref={ref}>
                    {options.map(option => (
                        <FormControlLabel
                            key={option.label}
                            value={option.value}
                            control={<Radio size="small" />}
                            label={option.label}
                            disabled={readonly}
                            checked={option.value === value}
                            onClick={() =>
                                onChange({ target: { value: option.value, name: name } })
                            }
                        />
                    ))}
                </RadioGroup>
                <FormHelperText>{error?.message ?? " "}</FormHelperText>
            </FormControl>
        )
    },
)

export default RadioGroupField
