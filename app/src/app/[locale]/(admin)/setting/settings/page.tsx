import dynamic from "next/dynamic"
import { ILayoutParams } from "@/types/common"
const ViewSettings = dynamic(() => import("@/views/Setting/Settings"), {
    ssr: false,
})

const Setting = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewSettings params={{ locale }} />
        </>
    )
}

export default Setting
