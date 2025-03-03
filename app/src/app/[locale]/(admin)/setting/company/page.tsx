import dynamic from "next/dynamic"
import { ILayoutParams } from "@/types/common"
const ViewCompany = dynamic(() => import("@/views/Setting/Company"), {
    ssr: false,
})

const Brand = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewCompany params={{ locale }} />
        </>
    )
}

export default Brand
