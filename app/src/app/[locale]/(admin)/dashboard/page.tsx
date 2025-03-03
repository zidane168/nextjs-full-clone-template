import dynamic from "next/dynamic"
const ViewDashboards = dynamic(() => import("@/views/Dashboard/Dashboards"), {
    ssr: false,
})

const Dashboards = () => {
    return (
        <>
            <ViewDashboards />
        </>
    )
}

export default Dashboards
