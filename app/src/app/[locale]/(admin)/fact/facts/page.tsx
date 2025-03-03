import dynamic from "next/dynamic"
import { ILayoutParams } from "@/types/common"
const ViewFacts = dynamic(() => import("@/views/Fact/Facts"), {
    ssr: false,
})

const Facts = ({ params: { locale } }: { params: ILayoutParams }) => {
    return (
        <>
            <ViewFacts params={{ locale }} />
        </>
    )
}

export default Facts
