import { ISelectOption } from "@/types/common"
import { FormHelperText, InputLabel, MenuItem, Select } from "@mui/material"
import FormControl from "@mui/material/FormControl"
import { useTranslations } from "next-intl"
import { forwardRef } from "react"
import { Control, useController } from "react-hook-form"

interface ISelectFieldProp {
    name: string
    control: Control<any>
    label: string
    disabled?: boolean
    options: any
    isAllOption?: boolean
    defaultValue?: any
    onChangeValue?: Function
    required?: boolean
    readOnly?: boolean
}

// eslint-disable-next-line react/display-name
const SelectField = forwardRef(
    (
        {
            name,
            control,
            label,
            disabled,
            options,
            defaultValue,
            isAllOption = false,
            onChangeValue,
            required,
            readOnly,
        }: ISelectFieldProp,
        ref,
    ) => {
        const t = useTranslations()
        const {
            field: { value, onChange, onBlur },
            fieldState: { invalid, error },
        } = useController({
            name,
            control,
            defaultValue: defaultValue ?? null,
        })
        const modifiedLabel = required ? `${label}*` : label

        const onSelectChange = (e: any) => {
            onChange(e)
            onChangeValue ? onChangeValue(e) : void 0
        }

        return (
            <FormControl
                variant="outlined"
                size="small"
                margin="normal"
                fullWidth
                disabled={disabled}
                error={invalid}>
                <InputLabel id={`${name}_label`}>{modifiedLabel}</InputLabel>
                <Select
                    notched
                    labelId={`${name}_label`}
                    id={name}
                    name={name}
                    readOnly={readOnly}
                    value={value !== null && value !== undefined ? value : ""}
                    defaultValue={defaultValue}
                    label={label}
                    onChange={onSelectChange}
                    onBlur={onBlur}
                    ref={ref}
                    displayEmpty>
                    {defaultValue === "" && (
                        <MenuItem value={""}>
                            {isAllOption ? t("common.all") : t("common.selectOne")}
                        </MenuItem>
                    )}
                    {defaultValue === 0 && (
                        <MenuItem value={0}>
                            {isAllOption ? t("common.all") : t("common.selectOne")}
                        </MenuItem>
                    )}
                    {options.map((option: ISelectOption) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{error?.message ?? " "}</FormHelperText>
            </FormControl>
        )
    },
)

SelectField.displayName = "SelectField"

export default SelectField
