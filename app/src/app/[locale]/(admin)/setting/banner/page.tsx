import dynamic from "next/dynamic"
import { ILayoutParams } from "@/types/common"
const ViewBanners = dynamic(() => import("@/views/Setting/Banners"), {
    ssr: false,
})

const Banner = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewBanners params={{ locale }} />
        </>
    )
}

export default Banner
