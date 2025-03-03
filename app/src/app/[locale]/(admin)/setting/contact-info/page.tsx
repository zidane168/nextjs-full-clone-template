import dynamic from "next/dynamic"
import { ILayoutParams } from "@/types/common"
const ViewContactInfos = dynamic(() => import("@/views/ContactInfo/ContactInfo"), {
    ssr: false,
})

const Brand = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewContactInfos params={{ locale }} />
        </>
    )
}

export default Brand
