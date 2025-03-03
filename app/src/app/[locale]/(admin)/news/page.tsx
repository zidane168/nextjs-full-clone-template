import dynamic from "next/dynamic"
import { ILayoutParams } from "@/types/common"
const ViewNews = dynamic(() => import("@/views/News/News"), {
    ssr: false,
})

const News = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewNews params={{ locale }} />
        </>
    )
}

export default News
