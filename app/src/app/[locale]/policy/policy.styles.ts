import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()(() => {
    return {
        container: {
            display: 'flex',
            flexDirection: 'column',
            width: '90%',
            height: '100%',
            paddingLeft: '2rem',
            paddingRight: '1rem',
            paddingBottom: '1rem',
            marginLeft: '3em',
            marginRight: '3em',
            marginTop: '2em', 
            border: '2px solid grey',
            boxShadow: '5px 10px 10px #fff',
        },
        format: {
            marginTop: '20px',
            borderRadius: '10px',
            backgroundColor: 'yellow',
            padding: '10px',
            fontWeight: 'bold',
            color: 'red',
            border: '2px solid grey',
            boxShadow: '5px 10px 10px #fff',
        }
    }
})

export default useStyles;