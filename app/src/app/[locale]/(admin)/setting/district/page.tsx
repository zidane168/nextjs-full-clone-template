import dynamic from "next/dynamic"
import { ILayoutParams } from "@/types/common"
const ViewDistricts = dynamic(() => import("@/views/Setting/Districts"), {
    ssr: false,
})

const District = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewDistricts params={{ locale }} />
        </>
    )
}

export default District
