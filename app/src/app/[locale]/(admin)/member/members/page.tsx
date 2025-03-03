import dynamic from "next/dynamic"
import { ILayoutParams } from "@/types/common"
const ViewMembers = dynamic(() => import("@/views/Member/Members"), {
    ssr: false,
})

const Members = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewMembers params={{ locale }} />
        </>
    )
}

export default Members
