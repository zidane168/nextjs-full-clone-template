import dynamic from "next/dynamic"
import { ILayoutParams } from "@/types/common"
const ViewDelivery = dynamic(() => import("@/views/Delivery/Delivery"), {
    ssr: false,
})

const Delivery = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewDelivery params={{ locale }} />
        </>
    )
}

export default Delivery
