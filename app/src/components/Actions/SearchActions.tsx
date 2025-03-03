import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import { useTranslations } from 'next-intl';

interface ISearchActionProps {
    reset: () => void;
}

function SearchActions({ ...props }: ISearchActionProps) {
    const t = useTranslations();
    const {
        reset,
    } = props;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button variant="contained" size="small" type='submit' sx={{marginRight: '15px'}}>
                        {t('common.search')}
                    </Button>
                    <Button variant="outlined" size="small" onClick={() => reset()} color="secondary">
                        {t('common.clear')}
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
}

export default SearchActions;
