import { ILayoutParams } from "@/types/common"
import dynamic from "next/dynamic"
const ViewRoles = dynamic(() => import("@/views/Roles/Roles"), {
    ssr: false,
})

const Roles = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewRoles params={{ locale }} />
        </>
    )
}

export default Roles
