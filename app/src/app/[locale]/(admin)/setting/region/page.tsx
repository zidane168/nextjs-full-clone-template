import dynamic from "next/dynamic"
import { ILayoutParams } from "@/types/common"
const ViewRegions = dynamic(() => import("@/views/Setting/Region"), {
    ssr: false,
})

const District = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewRegions params={{ locale }} />
        </>
    )
}

export default District
