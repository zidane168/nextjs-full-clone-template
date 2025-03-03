"use client"
import {
    Avatar,
    Box,
    Button,
    Icon,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from "@mui/material"
import useStyles from "./Header.styles"
import { useSearchParams } from "next/navigation"
import { useRouter, usePathname } from "next-intl/client"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import hkFlag from "@public/icons/hk-flag.svg"
import ukFlag from "@public/icons/uk-flag.svg"
import { useAppSelector } from "@/redux/hooks"
import { selectAuthUser } from "@/redux/features/auth/reducer"
import { imageLoader, redirectToLogout } from "@/utils/helpers/common"
import { WEBSITE_LANGUAGES } from "@/utils/constants"

const Header = () => {
    const t = useTranslations()
    const { classes } = useStyles()
    const router = useRouter()
    const pathname = usePathname()
    const query = useSearchParams()

    const user = useAppSelector(selectAuthUser)

    const nextLocale = useLocale()
    const handleClick = () => {
        redirectToLogout()
    }

    const handleLocaleChange = (event: SelectChangeEvent) => {
        router.push(`${pathname}?${query}`, { locale: event.target.value })
    }

    const getFlag = (currentLocale: string) => {
        let result = ukFlag
        switch (currentLocale) {
            case "tc":
                result = hkFlag
                break
            case "sc":
                result = hkFlag
                break
            case "en":
            default:
                result = ukFlag
                break
        }
        return result
    }

    return (
        <>
            <Box className={classes.headerWrapper}>
                <Typography
                    component={"h1"}
                    textAlign={"center"}
                    fontSize={"36px"}
                    color={"#9A7F56"}>
                    CHICKEN POT CMS
                </Typography>
                <Box className={classes.header} borderRadius="16px">
                    <Box display={"flex"} alignItems={"center"}>
                        <Box
                            textAlign={"center"}
                            marginRight={"1rem"}
                            fontSize={"16px"}
                            lineHeight={1}
                            paddingTop={"6px"}>
                            <Box fontWeight={"bold"} color={"#9A7F56"}>
                                {user?.name}
                            </Box>
                            <Button
                                onClick={handleClick}
                                style={{ padding: "0px", fontSize: "12px" }}>
                                {t("header.logout")}
                            </Button>
                        </Box>
                        <Box>
                            <Avatar>{user?.name?.charAt(0) ?? ""}</Avatar>
                        </Box>
                    </Box>
                    <Select
                        onChange={handleLocaleChange}
                        value={nextLocale}
                        className={classes.localeWrapper}
                        name="locale-select">
                        {WEBSITE_LANGUAGES.map(item => (
                            <MenuItem value={item} key={item}>
                                <Box className={classes.menuItem}>
                                    <Icon className={classes.icon}>
                                        <Image
                                            loader={imageLoader}
                                            width={0}
                                            height={0}
                                            style={{
                                                height: "fit-content",
                                                width: "100%",
                                            }}
                                            src={getFlag(item)}
                                            alt={item}
                                        />
                                    </Icon>
                                    <span>{t(`language.${item}`)}</span>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>
        </>
    )
}

export default Header
