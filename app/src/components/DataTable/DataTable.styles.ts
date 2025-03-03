import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => {
    return {
        evenRow: {
            backgroundColor: 'rgba(0,0,0,.03)',
        },
        oddRow: {
            backgroundColor: 'transparent'
        },
        headerCell: {
            color: '#fff',
            display: "flex",
            alignItems: "center",
            justifyContent: 'center',
            padding: '6px 10px',
            fontSize: "1rem",
            fontWeight: 'bold',
            textAlign: 'center'
        },
        bodyCell: {
            display: "flex",
            alignItems: "center",
            justifyContent: 'center',
            padding: '1px 10px'
        }
    };
});

export default useStyles;