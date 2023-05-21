/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import useCommonHomeStore, { getCommonHomeIndex } from '../../../app/stores/others/commonHomeStore';
import AllRequests from './components/AllRequests';
import TopHeader from './components/TopHeader';


const HomePage = () => {
    const { setSelectedReqType } = useCommonHomeStore();
    useEffect(() => {
        setSelectedReqType(0);
        getCommonHomeIndex();
    }, []);

    return (
        <>
            <TopHeader />
            <AllRequests />
        </>
    );
};

export default HomePage;