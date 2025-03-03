"use client"
import { getUserProfile, selectAuthUserPermissions } from "@/redux/features/auth/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IPermissionContainer, IPermissionSub } from "@/types/user"
import { MENU_PATHNAMES } from "@/utils/constants"
import BrandingWatermarkOutlinedIcon from "@mui/icons-material/BrandingWatermarkOutlined"
import EventIcon from "@mui/icons-material/Event"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import FastfoodIcon from "@mui/icons-material/Fastfood"
import FeedIcon from "@mui/icons-material/Feed"
import GroupsIcon from "@mui/icons-material/Groups"
import HomeIcon from "@mui/icons-material/Home"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"
import NewspaperIcon from "@mui/icons-material/Newspaper"
import ReceiptIcon from "@mui/icons-material/Receipt"
import ReportIcon from "@mui/icons-material/Report"
import SendToMobileIcon from "@mui/icons-material/SendToMobile"
import SettingsIcon from "@mui/icons-material/Settings"
import StoreIcon from "@mui/icons-material/Store"
import StorefrontIcon from "@mui/icons-material/Storefront"
import {
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material"
import { useLocale, useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { ReactNode, useEffect, useState } from "react"

const menuIcons: Record<string, ReactNode> = {
    dashboard: <HomeIcon />,
    administrator: <ManageAccountsIcon />,
    product: <StorefrontIcon />,
    offer: <LocalOfferIcon />,
    member: <GroupsIcon />,
    tier: <FeedIcon />,
    setting: <SettingsIcon />,
    push: <SendToMobileIcon />,
    event: <EventIcon />,
    fact: <FeedIcon />,
    report: <ReportIcon />,
    store: <StoreIcon />,
    delivery: <LocalShippingIcon />,
    news: <NewspaperIcon />,
    invoice: <ReceiptIcon />,
    brand: <BrandingWatermarkOutlinedIcon />,
    food: <FastfoodIcon />,
}

export default function Sidebar() {
    const t = useTranslations("sidebar")
    const dispatch = useAppDispatch()
    const router = useRouter()
    const locale = useLocale()
    const [expanded, setExpanded] = useState<string[]>([])
    const [selected, setSelected] = useState<string>("")
    const userPermissions = useAppSelector(selectAuthUserPermissions) ?? []

    const handleListExpanded = (slug: string) => {
        if (slug === "dashboard") router.push("/dashboard")

        setSelected(slug)
        if (expanded.includes(slug)) {
            setExpanded(expanded.filter(e => e !== slug))
        } else {
            setExpanded([...expanded, slug])
        }
    }

    useEffect(() => {
        dispatch(getUserProfile())
    }, [])

    return (
        <>
            <List sx={{ width: "100%", bgcolor: "background.paper", padding: 0 }} component="nav">
                <React.Fragment key={"dashboard"}>
                    <ListItemButton
                        sx={{ py: 1 }}
                        selected={selected === "dashboard"}
                        onClick={() => handleListExpanded("dashboard")}>
                        <ListItemIcon>{menuIcons?.["dashboard"] ?? <></>}</ListItemIcon>
                        <ListItemText
                            disableTypography
                            primary={
                                <Typography style={{ fontSize: "16px" }}>
                                    {t("dashboard")}
                                </Typography>
                            }
                        />
                    </ListItemButton>
                </React.Fragment>
                {userPermissions.map((item: IPermissionContainer) => {
                    return item.subjects.length > 0 ? (
                        <React.Fragment key={item.container}>
                            <ListItemButton
                                sx={{ py: 1 }}
                                selected={selected === item.container}
                                onClick={() => handleListExpanded(item.container)}>
                                <ListItemIcon>{menuIcons?.[item.container] ?? <></>}</ListItemIcon>
                                <ListItemText
                                    disableTypography
                                    primary={
                                        <Typography style={{ fontSize: "16px" }}>
                                            {t(item.container)}
                                        </Typography>
                                    }
                                />
                                {expanded.includes(item.container) ? (
                                    <ExpandLess />
                                ) : (
                                    <ExpandMore />
                                )}
                            </ListItemButton>
                            <Collapse
                                in={expanded.includes(item.container)}
                                timeout="auto"
                                unmountOnExit>
                                <List component="div" disablePadding style={{ background: "#eee" }}>
                                    {item.subjects.map((sub: IPermissionSub) => {
                                        const url =
                                            "/" +
                                                locale +
                                                (MENU_PATHNAMES?.[sub.subject]?.startsWith("/")
                                                    ? MENU_PATHNAMES?.[sub.subject]
                                                    : "/" + MENU_PATHNAMES?.[sub.subject]) ?? ""

                                        return sub?.actions?.length > 0 ? (
                                            <Link href={url} as={url} key={sub.subject}>
                                                <ListItemButton
                                                    sx={{
                                                        pl: 5,
                                                        py: 0.75,
                                                    }}
                                                    onClick={() => setSelected(sub.subject)}
                                                    selected={selected === sub.subject}>
                                                    <ListItemText
                                                        disableTypography
                                                        primary={
                                                            <Typography
                                                                style={{
                                                                    fontSize: "14px",
                                                                }}>
                                                                {t(sub.subject)}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItemButton>
                                            </Link>
                                        ) : (
                                            <></>
                                        )
                                    })}
                                </List>
                            </Collapse>
                        </React.Fragment>
                    ) : (
                        <></>
                    )
                })}
            </List>
        </>
    )
}
