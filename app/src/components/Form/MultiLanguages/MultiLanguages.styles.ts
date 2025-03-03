import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => {
    return {
        quillEditor: {
            fontFamily: "Roboto",
            '& .ql-container': {
                borderRadius: "0px 0px 4px 4px",
            },
            '& .ql-toolbar': {
                borderRadius: "4px 4px 0px 0px",
            }
        },
        quillEditorError: {
            '& .ql-container': {
                borderRadius: "0px 0px 4px 4px",
                borderLeft: "1px solid red !important",
                borderBottom: "1px solid red !important",
                borderRight: "1px solid red !important",
            },
            '& .ql-toolbar': {
                borderRadius: "4px 4px 0px 0px",
                border: "1px solid red !important",
            }
        }
    };
});

export default useStyles;