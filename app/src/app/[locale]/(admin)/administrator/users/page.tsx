import { ILayoutParams } from "@/types/common"
import dynamic from "next/dynamic"
const ViewUsers = dynamic(() => import("@/views/Users/Users"), {
    ssr: false,
})

const Users = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewUsers params={{ locale }} />
        </>
    )
}

export default Users
