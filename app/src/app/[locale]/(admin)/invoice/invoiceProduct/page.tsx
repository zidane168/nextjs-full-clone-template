import { ILayoutParams } from "@/types/common"
import dynamic from "next/dynamic"
const ViewInvoiceProduct = dynamic(() => import("@/views/Invoice/InvoiceProduct"), {
    ssr: false,
})
const InvoiceProduct = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewInvoiceProduct params={{ locale }} />
        </>
    )
}

export default InvoiceProduct
