import { MULTI_LANGUAGE_FIELD } from "@/utils/constants"
import { InputField, MultiLanguages } from "@/views/DynamicComponent/DynamicComponent"
import CloseIcon from "@mui/icons-material/Close"
import { Box, Grid, IconButton, Stack } from "@mui/material"
import { useTranslations } from "next-intl"
import { UseFieldArrayRemove, useFormContext } from "react-hook-form"

type DetailFieldsProps = {
    extraIndex: number
    detailIndex: number
    remove: UseFieldArrayRemove
    fields: Record<"id", string>[]
    id: string
}

const DetailFields = (props: DetailFieldsProps) => {
    const t = useTranslations()
    const { control, setValue, getValues } = useFormContext()
    const { id, extraIndex, detailIndex, remove: removeDetail, fields: detailFields } = props

    const styleNotFirstSection = {
        mt: "2rem",
    }

    const detailMultiLangFields = [
        {
            name: "name",
            type: MULTI_LANGUAGE_FIELD.TEXT,
            arrayParent: `extras`,
            nestedArray: "details",
        },
    ]

    const fieldName = `extras.${extraIndex}.details.${detailIndex}`
    const idOfExtraDetail = `${fieldName}.id`
    const priceFieldName = `${fieldName}.price`
    const sortFieldName = `${fieldName}.sort`

    const handleRemoveExtraDetail = () => {
        if (detailFields.length > 1) {
            const currentExtraDetailId = getValues(idOfExtraDetail)
            if (currentExtraDetailId) {
                const prevDeleteExtraDetailIds: number[] = getValues(`deleteExtraDetailIds`) || []
                prevDeleteExtraDetailIds.push(currentExtraDetailId)
                setValue(`deleteExtraDetailIds`, prevDeleteExtraDetailIds)
            }
            removeDetail(detailIndex)
        }
    }

    return (
        <Grid container spacing={2} mt={detailIndex !== 0 ? styleNotFirstSection : "5px"}>
            <Grid item xs={1}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }} key={id}>
                    {detailIndex + 1}.{" "}
                </Box>
            </Grid>
            <Grid item xs={10}>
                <Grid container spacing={2}>
                    <Grid item md={8} xs={12}>
                        <MultiLanguages
                            control={control}
                            fields={detailMultiLangFields}
                            prefixName={fieldName}
                            fieldIndex={extraIndex}
                            nestedFieldIndex={detailIndex}
                        />
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Stack spacing={2}>
                            <InputField
                                control={control}
                                name={priceFieldName}
                                label={t("food.extras.details.price")}
                                id={priceFieldName}
                            />
                            <InputField
                                control={control}
                                name={sortFieldName}
                                label={t("common.sort")}
                                id={sortFieldName}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={1}>
                <IconButton
                    aria-label={t("common.remove")}
                    onClick={() => handleRemoveExtraDetail()}>
                    <CloseIcon />
                </IconButton>
            </Grid>
        </Grid>
    )
}

export default DetailFields
