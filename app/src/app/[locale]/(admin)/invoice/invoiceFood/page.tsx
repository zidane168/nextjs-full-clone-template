import { ILayoutParams } from "@/types/common"
import dynamic from "next/dynamic"
const ViewInvoiceFood = dynamic(() => import("@/views/Invoice/InvoiceFood"), {
    ssr: false,
})
const InvoiceFood = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewInvoiceFood params={{ locale }} />
        </>
    )
}

export default InvoiceFood
