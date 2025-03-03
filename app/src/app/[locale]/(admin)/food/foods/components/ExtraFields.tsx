import { MULTI_LANGUAGE_FIELD } from "@/utils/constants"
import {
    InputField,
    MultiLanguages,
    RadioGroupField,
} from "@/views/DynamicComponent/DynamicComponent"
import CloseIcon from "@mui/icons-material/Close"
import { Box, Grid, IconButton, Stack } from "@mui/material"
import { useTranslations } from "next-intl"
import { useEffect } from "react"
import { UseFieldArrayRemove, useFormContext } from "react-hook-form"
import ItemsSection from "./DetailsSection"

type ExtraFieldsProps = {
    id: string
    extraIndex: number
    fields: Record<"id", string>[]
    remove: UseFieldArrayRemove
}

const ExtraFields = (props: ExtraFieldsProps) => {
    const t = useTranslations()
    const { control, setValue, watch, getValues } = useFormContext()
    const { id, extraIndex, fields: extraFields, remove: removeExtras } = props

    const styleNotFirstSection = {
        mt: "2rem",
    }

    const extraMultiLangFields = [
        {
            name: "name",
            type: MULTI_LANGUAGE_FIELD.TEXT,
            arrayParent: "extras",
        },
    ]

    const fieldName = `extras.${extraIndex}`
    const idOfExtra = `${fieldName}.id`
    const limitFieldName = `${fieldName}.limit`
    const reqOptFieldName = `${fieldName}.reqOpt`
    const sortFieldName = `${fieldName}.sort`

    const reqOptValue = watch(reqOptFieldName)

    const handleRemoveExtra = () => {
        if (extraFields.length > 1) {
            const currentExtraId = getValues(idOfExtra)
            if (currentExtraId) {
                const prevDeleteExtraIds: number[] = getValues(`deleteExtraIds`) || []
                prevDeleteExtraIds.push(currentExtraId)
                setValue(`deleteExtraIds`, prevDeleteExtraIds)
            }
            removeExtras(extraIndex)
        }
    }

    useEffect(() => {
        if (reqOptValue) {
            setValue(limitFieldName, 1)
        }
    }, [reqOptValue])

    return (
        <Grid container spacing={2} mt={extraIndex !== 0 ? styleNotFirstSection : "5px"}>
            <Grid item xs={1}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }} key={id}>
                    {extraIndex + 1}.{" "}
                </Box>
            </Grid>
            <Grid item xs={10}>
                <Grid container spacing={2}>
                    <Grid item md={8} xs={12}>
                        <MultiLanguages
                            control={control}
                            fields={extraMultiLangFields}
                            prefixName={fieldName}
                            fieldIndex={extraIndex}
                        />
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Stack spacing={2}>
                            <InputField
                                inputProps={{ readOnly: reqOptValue === true }}
                                control={control}
                                name={limitFieldName}
                                label={t("food.extras.limit")}
                                id={limitFieldName}
                            />
                            <InputField
                                control={control}
                                name={sortFieldName}
                                label={t("common.sort")}
                                id={sortFieldName}
                            />
                            <RadioGroupField
                                name={reqOptFieldName}
                                control={control}
                                label={t("food.extras.reqOpt")}
                                options={[
                                    { label: t("common.true"), value: true },
                                    {
                                        label: t("common.false"),
                                        value: false,
                                    },
                                ]}
                            />
                        </Stack>
                    </Grid>
                    <ItemsSection extraIndex={extraIndex} />
                </Grid>
            </Grid>
            <Grid item xs={1}>
                <IconButton aria-label={t("common.remove")} onClick={() => handleRemoveExtra()}>
                    <CloseIcon />
                </IconButton>
            </Grid>
        </Grid>
    )
}

export default ExtraFields
