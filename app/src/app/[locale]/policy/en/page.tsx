'use client';  
import { getFact, selectFact } from "@/redux/features/fact/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import useStyles from "../policy.styles";

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
        <div className={ classes.container }> 
            <h3 className={ classes.format }> EN </h3>
            <div dangerouslySetInnerHTML={{ __html: fact.content ? fact.content.en : '' }} /> 
        </div>
    )

}
export default PolicyEN;


