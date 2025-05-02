import React, { useContext } from 'react';
import { AuthContext } from './AuthProviders';
import Loading from '../Layout/Loading';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {
    const { user,       
        dbUser,     
        loading, }= useContext(AuthContext);
    if(loading){
        return <Loading></Loading>
    }
    if(dbUser && dbUser?.uid){
        return children
    }
    return <Navigate state={location.pathname} to='/auth/signin'></Navigate>
};

export default PrivateRoute;