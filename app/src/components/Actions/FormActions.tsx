import React from "react"
import { Box, Button, Grid } from "@mui/material"
import { useTranslations } from "next-intl"
import { LoadingButton } from "@mui/lab"

interface IFormActionProps {
    backMainPage: () => void
    isSubmitting?: boolean
    viewOnly?: boolean
    isValid?: boolean
}

function FormActions({ ...props }: IFormActionProps) {
    const t = useTranslations()
    const { backMainPage, isSubmitting = false, viewOnly = false, isValid } = props

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                    {!viewOnly && (
                        <LoadingButton
                            size="small"
                            variant="contained"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            type="submit"
                            sx={{ marginRight: "15px" }}>
                            {t("common.save")}
                        </LoadingButton>
                    )}
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => backMainPage()}
                        color="secondary">
                        {t("common.cancel")}
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}

export default FormActions
