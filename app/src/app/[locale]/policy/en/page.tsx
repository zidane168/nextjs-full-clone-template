'use client';  
import { getFact, selectFact } from "@/redux/features/fact/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import useStyles from "../policy.styles";
import { Autocomplete, Box, Button, Card, CardContent, CardMedia, Checkbox, Container, Fab, FormControlLabel, FormGroup, Grid, Pagination, Stack, Typography } from "@mui/material";
 

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import NavigationIcon from '@mui/icons-material/Navigation'
import FavoriteIcon from '@mui/icons-material/Favorite'

const PolicyEN = () => {
    const { classes } = useStyles(); 
    const dispatch = useAppDispatch()  

    const fact = useAppSelector(selectFact)  

    const fetchItem = async () => {
       await dispatch(getFact("2"))
    } 

    if (!fact) {
        return <div>Loading...</div>;
    } 

    useEffect(() => { 
        fetchItem()  
    }, [ dispatch ] )

    return (

        <>
            <Container  maxWidth="lg" >
                <div className={classes.format}>
                    Hello world
                </div>
            </Container> 
                
            <Grid container spacing={2} m={4}>
                <Grid   key="1" lg={3}  item> 
                    <CardMedia 
                        component="img"
                        alt="green iguana"
                        height="140"
                        image="/images/placeholder-image.jpeg"
                    />  
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Lizard 
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Lizards are a widespread group of squamate reptiles, with over 6000 species, ranging across all continents except Antarctica
                        </Typography>
                    </CardContent>   
                </Grid>  

                <Grid key="2" lg={3}   item> 
                    <CardMedia 
                        component="img"
                        alt="green iguana"
                        height="140"
                        image="/images/placeholder-image.jpeg"
                    />  
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Lizard 
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Lizards are a widespread group of squamate reptiles, with over 6000 species, ranging across all continents except Antarctica
                        </Typography>
                    </CardContent>   
                </Grid>  


                <Grid key="3" lg={3}  item> 
                    <CardMedia 
                        component="img"
                        alt="green iguana"
                        height="140"
                        image="/images/placeholder-image.jpeg"
                    />  
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Lizard 
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Lizards are a widespread group of squamate reptiles, with over 6000 species, ranging across all continents except Antarctica
                        </Typography>
                    </CardContent>   
                </Grid>   
            </Grid>  

            <Grid container  spacing={2} m={4} justifyContent={ 'center' }> 
                <Grid key="4" md={3} item> 
                    <CardMedia 
                        component="img"
                        alt="green iguana"
                        height="140"
                        image="/images/placeholder-image.jpeg"
                    />  
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Lizard 
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Lizards are a widespread group of squamate reptiles, with over 6000 species, ranging across all continents except Antarctica
                        </Typography>
                    </CardContent>   
                </Grid>  

                <Grid key="5" md={3} item> 
                    <CardMedia 
                        component="img"
                        alt="green iguana"
                        height="140"
                        image="/images/placeholder-image.jpeg"
                    />  
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Lizard 
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Lizards are a widespread group of squamate reptiles, with over 6000 species, ranging across all continents except Antarctica
                        </Typography>
                    </CardContent>   
                </Grid>  

                <Grid key="5" md={3}   item> 
                    <CardMedia 
                        component="img"
                        alt="green iguana"
                        height="140"
                        image="/images/placeholder-image.jpeg"
                    />  
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Lizard 
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Lizards are a widespread group of squamate reptiles, with over 6000 species, ranging across all continents except Antarctica
                        </Typography>
                    </CardContent>   
                </Grid>  
            </Grid> 

           <Stack  spacing={ 2 } direction={"row"} padding={ 2 }>
               <Box> anc </Box>
               <Typography>
                    2323
               </Typography> 
           </Stack>
 
            <div className={ classes.content } >
                <Button variant="text"> Text </Button>
                <Button variant="contained"> Contained </Button>
                <Button onClick={ () => {
                    alert('clicked')
                }} variant="outlined"> Outlined </Button>
            </div>

            <div className={ classes.justifyCenter }> 

                <FormGroup>
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                    <FormControlLabel required control={<Checkbox />} label="Required" />
                    <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
                </FormGroup>
 
            </div>

            <Fab color="primary" aria-label="add">
                <AddIcon />
            </Fab>
            <Fab color="secondary" aria-label="edit">
                <EditIcon />
            </Fab>
            <Fab variant="extended">
                <NavigationIcon sx={{ mr: 1 }} />
                Navigate
            </Fab>
            <Fab disabled aria-label="like">
                <FavoriteIcon />
            </Fab>
        </>

    return (
        <div className={ classes.container }> 
            <h3 className={ classes.format }> EN </h3>
            <div dangerouslySetInnerHTML={{ __html: fact.content ? fact.content.en : '' }} /> 
        </div>
    )

}
export default PolicyEN;


