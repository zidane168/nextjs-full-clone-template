import { ILayoutParams } from "@/types/common"
import dynamic from "next/dynamic"
const ViewFoods = dynamic(() => import("@/views/Food/Foods"), {
    ssr: false,
})

const Foods = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewFoods params={{ locale }} />
        </>
    )
}

export default Foods
