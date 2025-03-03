import { ILayoutParams } from "@/types/common"
import dynamic from "next/dynamic"
const ViewFoodCategories = dynamic(() => import("@/views/Food/FoodCategories"), {
    ssr: false,
})

const ProductCategories = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewFoodCategories params={{ locale }} />
        </>
    )
}

export default ProductCategories
