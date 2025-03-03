import { ILayoutParams } from "@/types/common"
import dynamic from "next/dynamic"
const ViewFactCategories = dynamic(() => import("@/views/Fact/FactCategories"), {
    ssr: false,
})

const FactCategories = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewFactCategories params={{ locale }} />
        </>
    )
}

export default FactCategories
