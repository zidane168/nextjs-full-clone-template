import { ACTIONS } from "@/utils/constants"
import { Box, Button, Grid } from "@mui/material"
import { useRouter } from "next/navigation"
import AddIcon from "@mui/icons-material/Add"
import GetAppIcon from "@mui/icons-material/GetApp"
import { useTranslations } from "next-intl"

// Inside your component
interface IPageHeadingProps {
    title: string
    permissionActions?: string[]
    pageActions?: string[]
    currentPathname: string
    onExport?: () => void
    actionButton?: React.JSX.Element[] | React.JSX.Element
}

export default function PageHeading({ ...props }: IPageHeadingProps) {
    const t = useTranslations()
    const router = useRouter()
    const { title, permissionActions, pageActions, currentPathname, onExport, actionButton } = props

    const onCreate = () => {
        router.push(`${currentPathname}/${ACTIONS.create}`)
    }

    return (
        <Box
            sx={{
                borderBottom: "1px solid #9A7F56",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
            }}>
            <Box sx={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.5 }}>{title}</Box>
            <Box display="flex" justifyContent="flex-end" sx={{ marginBottom: "10px" }}>
                <Grid container spacing={2}>
                    {permissionActions?.includes(ACTIONS.create) &&
                        pageActions?.includes(ACTIONS.create) && (
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    size="small"
                                    onClick={() => onCreate()}
                                    color="primary">
                                    {t("common.create")}
                                </Button>
                            </Grid>
                        )}
                    {permissionActions?.includes(ACTIONS.export) &&
                        pageActions?.includes(ACTIONS.export) && (
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    startIcon={<GetAppIcon />}
                                    size="small"
                                    onClick={() => {
                                        if (onExport) onExport()
                                    }}
                                    color="success">
                                    {t("common.export")}
                                </Button>
                            </Grid>
                        )}
                    {Array.isArray(actionButton) &&
                        actionButton.length > 0 &&
                        actionButton.map((item, index) => (
                            <Grid item key={index}>
                                {item}
                            </Grid>
                        ))}
                        
                    {!Array.isArray(actionButton) && actionButton}
                </Grid>
            </Box>
        </Box>
    )
}
