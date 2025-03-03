import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => {
    return {
        headerWrapper: {
            display: 'flex',
            height: 'auto',
            justifyContent: 'space-between',
            alignItems: 'start',
            gap: '40px',
            background: '#fff', 
            boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.10)',
            padding: '0px 20px'
        },
        header: {
            height: 'max-content', 
            width: 'max-content', 
            display: 'flex',
            alignItems: 'center', 
            gap: '48px',
        },
        localeWrapper: {
            minWidth: '160px', 
            maxHeight: '40px'
        },
        menuItem: {
            display: 'flex', 
            justifyContent: 'flex-start', 
            alignItems: 'center', 
            gap: '8px'
        },
        icon: {
            display: 'flex', 
            alignItems: 'center' 
        }
    };
});

export default useStyles;