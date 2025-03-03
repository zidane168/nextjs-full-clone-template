import React from "react"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import { Box, Chip } from "@mui/material"
import { Control, Controller, useController } from "react-hook-form"
import { forwardRef } from "react"
import Image from "next/image"
import { imageLoader } from "@/utils/helpers/common"

interface IAutoCompleteProp {
    name: string
    control: Control<any>
    label: string
    disabled?: boolean
    options: any
    isAllOption?: boolean
    defaultValue?: any
    getOptionLabel?: (option: any) => string
    onChangeValue?: Function
    countryOption?: boolean
    required?: boolean
}

// eslint-disable-next-line react/display-name
const AutoCompleteSelect = forwardRef(
    (
        {
            name,
            control,
            label,
            options = [],
            defaultValue,
            getOptionLabel,
            countryOption,
            onChangeValue,
            required,
        }: IAutoCompleteProp,
        ref,
    ) => {
        const {
            field: { value, onChange, onBlur },
            fieldState: { invalid, error },
        } = useController({
            name,
            control,
            defaultValue: defaultValue || null,
        })
        const modifiedLabel = required ? `${label}*` : label
        const onSelectChange = (data: any) => {
            onChange(countryOption ? data?.phone : data?.value || null)
            onChangeValue ? onChangeValue(data) : void 0
        }
        return (
            <Controller
                control={control}
                name={name}
                render={() => (
                    <Autocomplete
                        ref={ref}
                        fullWidth
                        options={options}
                        onBlur={onBlur}
                        getOptionLabel={getOptionLabel}
                        ListboxProps={{
                            style: {
                                overflow: "auto",
                            },
                        }}
                        renderOption={(props, option) => {
                            return countryOption && countryOption ? (
                                <Box
                                    component="li"
                                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                    {...props}
                                    key={option.code}>
                                    <Image
                                        loader={imageLoader}
                                        key={option.phone}
                                        width={23}
                                        height={18}
                                        src={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png`}
                                        alt={option.code ?? ""}
                                        loading="lazy"
                                    />
                                    {option.label} ({option.code}) +{option.phone}
                                </Box>
                            ) : (
                                <Box
                                    component="li"
                                    {...props}
                                    sx={{ width: "100%" }}
                                    key={option.value}>
                                    {option.label}
                                </Box>
                            )
                        }}
                        renderTags={(tagValue, getTagProps) => {
                            return tagValue.map((option, index) =>
                                countryOption ? (
                                    <Chip
                                        {...getTagProps({ index })}
                                        key={option.code}
                                        label={option.label}
                                    />
                                ) : (
                                    <Chip
                                        {...getTagProps({ index })}
                                        key={option.value}
                                        label={option.label}
                                    />
                                ),
                            )
                        }}
                        isOptionEqualToValue={(option, value) =>
                            countryOption
                                ? option.phone === value.phone
                                : option.value === value.value
                        }
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={modifiedLabel}
                                error={invalid}
                                helperText={error?.message ?? " "}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                            />
                        )}
                        onChange={(_, data) => onSelectChange(data)}
                        value={
                            options.find((option: any) =>
                                countryOption ? option.phone === value : option.value === value,
                            ) || null
                        }
                    />
                )}
            />
        )
    },
)

AutoCompleteSelect.displayName = "AutoCompleteSelect"

export default AutoCompleteSelect
