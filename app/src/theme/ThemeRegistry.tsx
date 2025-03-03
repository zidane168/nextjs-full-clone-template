"use client"

import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material"
import { NextAppDirEmotionCacheProvider } from "./EmotionCache"
import CssBaseline from "@mui/material/CssBaseline"
import { Roboto } from "next/font/google"
// Augment the palette to include an ochre color
declare module "@mui/material/styles" {
    interface Palette {
        inputText: Palette["primary"]
    }
    interface PaletteOptions {
        inputText: PaletteOptions["primary"]
    }
}

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
})

const themeOpttions: ThemeOptions = {
    typography: {
        fontFamily: roboto.style.fontFamily,
        fontSize: 14,
    },
    palette: {
        inputText: {
            main: "#607080",
        },
    },
    components: {
        MuiInputLabel: {
            defaultProps: {
                shrink: true,
            },
        },
        MuiTextField: {
            defaultProps: {
                size: "small",
                variant: "outlined",
                fullWidth: true,
                margin: "normal",
                InputLabelProps: { shrink: true },
            },
        },
        MuiGrid: {
            defaultProps: {
                sx: {
                    marginBottom: "0px",
                },
            },
        },
        MuiSelect: {
            defaultProps: {
                size: "small",
                fullWidth: true,
            },
        },
        MuiFormControl: {
            defaultProps: {
                fullWidth: true,
            },
        },
    },
}

const theme = createTheme(themeOpttions)

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    return (
        <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </NextAppDirEmotionCacheProvider>
    )
}
