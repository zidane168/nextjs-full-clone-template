import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => {
    return {
        auth: {
            height: '100vh',
            overflowX: 'hidden',
        },
        main: {
            display: 'flex',
            flexWrap: 'wrap',
            height: '100%',
        },
        authLeft: {
            height: '100%',
            padding: '5rem 8rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        authRight: {
            backgroundColor: '#4059a1',
            height: '100%',
        },
        authTitle: {
            fontSize: '4rem',
            marginBottom: '2rem',
            color: '#25396f',
            fontWeight: '700',
            lineHeight: '1.2',
            marginTop: '0',
        },
        formContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            color: '#25396f',
        },
    };
});

export default useStyles;
