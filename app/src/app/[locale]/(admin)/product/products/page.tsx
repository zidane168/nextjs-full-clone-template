import { ILayoutParams } from "@/types/common"
import dynamic from "next/dynamic"
const ViewProducts = dynamic(() => import("@/views/Product/Products"), {
    ssr: false,
})

const Products = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewProducts params={{ locale }} />
        </>
    )
}

export default Products
