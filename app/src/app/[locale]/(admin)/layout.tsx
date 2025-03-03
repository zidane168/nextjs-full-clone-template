import AppContainer from "@/components/AppContainer/AppContainer"
import { Box, CircularProgress } from "@mui/material"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import dynamic from "next/dynamic"
const ViewSideBar = dynamic(() => import("@/components/Sidebar/Sidebar"), { ssr: false })
const Header = dynamic(() => import("@/components/Header/Header"), { ssr: false })
const rootContainerSx = {
    width: "100%",
    minHeight: "calc(100vh - 50px)",
    display: "flex",
    marginTop: "1px",
}

const mainGridSx = {
    height: "100%",
    gridTemplateRows: "1fr 11fr",
    width: "calc(100% - 300px)",
    padding: "15px",
}

const sidebarSx = {
    display: "flex",
    alignItems: "stretch",
    background: "#fff",
    width: "300px",
    overflow: "auto",
    boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.20)",
}

const loadingIndecator = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 999,
    display: "none",
}

const loadingIndecatorContent = {
    display: "flex",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
}

const loadingIndecatorBg = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    opacity: 0.5,
    backgroundColor: "rgba(250, 250, 250)",
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AppContainer>
            <Box sx={loadingIndecator} id="loading-indecator">
                <Box sx={loadingIndecatorBg}></Box>
                <Box sx={loadingIndecatorContent}>
                    <CircularProgress />
                </Box>
            </Box>
            <Header />
            <Box sx={rootContainerSx}>
                <Box sx={sidebarSx}>
                    <ViewSideBar />
                </Box>
                <Box sx={mainGridSx}>
                    <ToastContainer />
                    <div>{children}</div>
                </Box>
            </Box>
        </AppContainer>
    )
}

export default AdminLayout
