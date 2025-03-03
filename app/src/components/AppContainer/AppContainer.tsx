"use client"
import useStyles from "./AppContainer.styles"

type AppContainerProps = {
    children: React.ReactNode;
}

export default function AppContainer({children}: AppContainerProps) {
    const { classes } = useStyles();
    return (
        <div className={classes.root}>
            {children}
        </div>
    )
}