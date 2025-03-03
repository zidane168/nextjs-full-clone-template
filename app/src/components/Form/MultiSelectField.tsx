import { IMultiSelectFieldProp, ISelectOption } from "@/types/common"
import {
    Checkbox,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    FormHelperText,
} from "@mui/material"
import FormControl from "@mui/material/FormControl"
import { useTranslations } from "next-intl"
import { forwardRef } from "react"
import { useController } from "react-hook-form"

// eslint-disable-next-line react/display-name
const MultiSelectField = forwardRef(
    (
        {
            name,
            control,
            label,
            disabled,
            options,
            defaultValue,
            isAllOption = false,
        }: IMultiSelectFieldProp,
        ref,
    ) => {
        const t = useTranslations()
        const {
            field: { onChange, onBlur, value },
            fieldState: { invalid, error },
        } = useController({
            control,
            name,
            defaultValue: defaultValue ?? [],
        })

        return (
            <FormControl
                variant="outlined"
                size="small"
                margin="normal"
                fullWidth
                disabled={disabled}
                error={invalid}>
                <InputLabel id={`${name}_label`}>{label}</InputLabel>
                <Select
                    notched
                    labelId={`${name}_label`}
                    multiple
                    value={value || []}
                    input={<OutlinedInput label={label} />}
                    onChange={onChange}
                    onBlur={onBlur}
                    ref={ref}
                    displayEmpty
                    renderValue={selected => {
                        const selectedLabel = Array.isArray(selected)
                            ? selected?.map((sel: ISelectOption["value"]) => {
                                  const item = options.find(
                                      (option: ISelectOption) => option?.value === sel,
                                  )
                                  return item ? item.label : ""
                              })
                            : []
                        return selectedLabel?.join(", ")
                    }}>
                    {isAllOption && <MenuItem value="">{t("common.all")}</MenuItem>}
                    {options.map((opt: ISelectOption) => (
                        <MenuItem key={opt.value} value={opt.value}>
                            <Checkbox
                                id={opt.value.toString()}
                                checked={(value || []).indexOf(opt.value) > -1}
                            />
                            <ListItemText primary={opt.label} />
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{error?.message ?? " "}</FormHelperText>
            </FormControl>
        )
    },
)

export default MultiSelectField
