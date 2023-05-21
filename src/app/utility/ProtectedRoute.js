/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import SplashScreen from '../../components/layout/SplashScreen';
import useAuthStore from '../stores/others/authStore';
import useGeneralStore from '../stores/others/generalStore';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { loaded, setLoaded } = useGeneralStore();
    const { is_logged_in, is_verified } = useAuthStore();
    const [is_initialized, setIsInitialized] = useState(false);

    useEffect(() => {
        let tm;
        tm = setTimeout(() => {
            setIsInitialized(true);
            !is_logged_in && setLoaded(true);
        }, 3000);

        return () => clearTimeout(tm);
    }, []);


    return (loaded && is_initialized) ? ((is_logged_in && is_verified) ? <Outlet /> : <Navigate to="/login" />) : <SplashScreen />
}

export default ProtectedRoute