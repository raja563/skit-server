import React, {useContext} from "react";
import {Navigate} from 'react-router-dom'
import AuthContext from "../components/Context/AuthContext";

const PrivateRouter=({children})=>{

    const {user,loading}=useContext(AuthContext);
    if(loading){
        return<div>loading</div>
    }
    if(!user){
        return<Navigate to='/login'/>
    }
    return children;



}

export default PrivateRouter;