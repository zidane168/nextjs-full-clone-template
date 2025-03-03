import { IDetailExtra } from "@/types/food"
import { Box, Button, Grid } from "@mui/material"
import { useEffect } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import AddIcon from "@mui/icons-material/Add"
import { useTranslations } from "next-intl"
import DetailFields from "./DetailFields"
import { LANGUAGE_INIT_DATA } from "@/utils/constants"

type DetailsSectionProps = {
    extraIndex: number
}

const DetailsSection = (props: DetailsSectionProps) => {
    const t = useTranslations()
    const { control } = useFormContext()
    const { extraIndex } = props

    const {
        fields: detailFields,
        append: appendDetail,
        remove: removeDetail,
        replace: replaceDetail,
    } = useFieldArray({
        control,
        name: `extras.${extraIndex}.details`,
    })

    const initDetail = {
        name: LANGUAGE_INIT_DATA,
        price: 0,
        sort: 0,
    } as IDetailExtra

    useEffect(() => {
        if (detailFields.length === 0) {
            replaceDetail([initDetail])
        }
    }, [])

    return (
        <Grid item xs={12} key={extraIndex}>
            <Box>
                <h5>{t("food.extras.details.title")}</h5>
            </Box>
            <Box>
                {detailFields.map((detail, detailIndex) => {
                    return (
                        <DetailFields
                            key={`details-${detail.id}`}
                            id={detail.id}
                            remove={removeDetail}
                            fields={detailFields}
                            detailIndex={detailIndex}
                            extraIndex={extraIndex}
                        />
                    )
                })}
                <Grid container spacing={2}>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={10}>
                        <Button
                            sx={{ mb: "20px" }}
                            size="small"
                            variant="contained"
                            onClick={() => appendDetail(initDetail)}
                            startIcon={<AddIcon />}>
                            {t("food.extras.detail")}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    )
}

export default DetailsSection
