import { ILayoutParams } from "@/types/common"
import dynamic from "next/dynamic"
const ViewProductCategories = dynamic(() => import("@/views/Product/ProductCategories"), {
    ssr: false,
})

const ProductCategories = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewProductCategories params={{ locale }} />
        </>
    )
}

export default ProductCategories
