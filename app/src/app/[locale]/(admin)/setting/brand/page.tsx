import dynamic from "next/dynamic"
import { ILayoutParams } from "@/types/common"
const ViewBrands = dynamic(() => import("@/views/Setting/Brands"), {
    ssr: false,
})

const Brand = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewBrands params={{ locale }} />
        </>
    )
}

export default Brand
