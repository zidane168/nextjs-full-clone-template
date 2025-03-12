import "@/styles/globals.css"
import type { Metadata } from "next"
import ReduxProvider from "@/redux/provider"
import ThemeRegistry from "@/theme/ThemeRegistry"
import { NextIntlClientProvider } from "next-intl"
import { notFound } from "next/navigation"
import { Auth } from "@/components/Auth"
import { WEBSITE_LANGUAGES } from "@/utils/constants"
import { ILayoutParams } from "@/types/common"

export const metadata: Metadata = {
    title: "CRM",
    description: "Built for CRM",
}

export async function generateStaticParams() {
    return WEBSITE_LANGUAGES.map(locale => ({ locale }))
}

async function getMessages(locale: string) {
    try {
        return (await import(`../../messages/${locale}.json`)).default
    } catch (error) {
        notFound()
    }
}

const locales = ["en", "tc", "sc"]

export default async function RootLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode
    params: ILayoutParams
}) {
    const isValidLocale = locales.some(cur => cur === locale)
    if (!isValidLocale) notFound()
    const messages = await getMessages(locale)

    return (
        <html lang={locale}>
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <ThemeRegistry>
                <body>
                    <ReduxProvider>
                        <NextIntlClientProvider locale={locale} messages={messages}>
                            <Auth locale={locale}>{children}</Auth>
                        </NextIntlClientProvider>
                    </ReduxProvider>
                </body>
            </ThemeRegistry>
        </html>
    )
}
