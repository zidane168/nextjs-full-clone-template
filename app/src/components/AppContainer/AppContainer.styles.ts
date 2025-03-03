import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => {
    return {
        root: {
            backgroundColor: '#F9F6F2',
            height: '100%',
            minHeight: '100vh',
            width: '100%',
            overflow: 'hidden'
        }
    };
});

export default useStyles;