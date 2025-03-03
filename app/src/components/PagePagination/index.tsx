import { Box, Pagination, Stack } from "@mui/material"

type PaginationData = {
    totalPage: number
    page: number
    setPage: Function
}

export default function PagePagination({ ...props }: PaginationData) {
    const { totalPage, setPage, page } = props

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "10px",
                marginTop: "20px",
            }}>
            <Stack spacing={2}>
                <Pagination
                    count={totalPage}
                    showFirstButton
                    showLastButton
                    page={page}
                    onChange={handleChange}
                />
            </Stack>
        </Box>
    )
}
