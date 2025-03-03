import dynamic from "next/dynamic"
import { ILayoutParams } from "@/types/common"
const ViewStores = dynamic(() => import("@/views/Store/Store"), {
    ssr: false,
})

const News = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewStores params={{ locale }} />
        </>
    )
}

export default News
