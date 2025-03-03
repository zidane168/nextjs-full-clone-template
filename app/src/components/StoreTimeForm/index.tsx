import { Grid, Stack } from "@mui/material"
import { useTranslations } from "next-intl"
import React from "react"
import { Control } from "react-hook-form"
import InputField from "../Form/InputField"

import SelectField from "../Form/SelectField"
import { DAYS } from "@/utils/constants"
import TimePickerField from "../Form/TimePickerField"

const StoreTimeForm = ({
    name,
    control,
    index,
}: {
    name: string
    control: Control<any, any>
    index: number
}) => {
    const t = useTranslations()
    return (
        <Grid container spacing={2}>
            <Grid item xs={"auto"} style={{ minWidth: "150" }}>
                <SelectField
                    control={control}
                    options={DAYS}
                    name={`${name}.${index}.day`}
                    label={"Day"}
                />
            </Grid>
            <Grid item xs={"auto"}>
                <TimePickerField
                    control={control}
                    name={`${name}.${index}.open`}
                    label={"Open time"}
                />
            </Grid>
            <Grid item xs={"auto"}>
                <TimePickerField
                    control={control}
                    name={`${name}.${index}.close`}
                    label={"Close time"}
                />
            </Grid>
        </Grid>
    )
}

export default StoreTimeForm
