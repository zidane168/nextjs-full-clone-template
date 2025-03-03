import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => {
    return {
        evenRow: {
            backgroundColor: 'rgba(0,0,0,.05)',
        },
        oddRow: {
            backgroundColor: 'transparent'
        },
        rowFirstCell: {
            borderRight: '1px solid #ddd',
            maxWidth: '300px'
        },
        headerCell: {
            display: "flex",
            alignItems: "center",
            justifyContent: 'center',
            padding: '6px 10px',
            fontSize: "1.2rem",
            fontWeight: 500,
            border: '1px solid rgb(128, 128, 128'
        },
        bodyCell: {
            display: "flex",
            alignItems: "center",
            justifyContent: 'flex-start',
            padding: '1px 10px',
        }
    };
});

export default useStyles;