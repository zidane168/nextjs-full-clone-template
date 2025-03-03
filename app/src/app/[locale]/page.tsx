import { ILayoutParams } from "@/types/common"
import { redirect } from "next/navigation"
export default async function Home({
    params: { locale },
}: {
    params: ILayoutParams
}) {
    redirect(`${locale}/dashboard`)
}
