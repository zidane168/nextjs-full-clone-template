import { Grid } from "@mui/material"
import { useTranslations } from "next-intl"
import { Control } from "react-hook-form"
import InputField from "../Form/InputField"

const FoodExtrasForm = ({
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
            <Grid item xs={"auto"}>
                <InputField
                    name={`${name}.${index}.name.en`}
                    label={t("product.extraFoods.en")}
                    control={control}
                />
            </Grid>
            <Grid item xs={"auto"}>
                <InputField
                    name={`${name}.${index}.name.tc`}
                    label={t("product.extraFoods.tc")}
                    control={control}
                />
            </Grid>
            <Grid item xs={"auto"}>
                <InputField
                    name={`${name}.${index}.name.sc`}
                    label={t("product.extraFoods.sc")}
                    control={control}
                />
            </Grid>
            <Grid item xs={"auto"}>
                <InputField
                    name={`${name}.${index}.price`}
                    label={t("product.extraFoods.price")}
                    control={control}
                />
            </Grid>
            <Grid item xs={"auto"}>
                <InputField
                    name={`${name}.${index}.sort`}
                    label={t("product.extraFoods.sort")}
                    control={control}
                />
            </Grid>
        </Grid>
    )
}

export default FoodExtrasForm
