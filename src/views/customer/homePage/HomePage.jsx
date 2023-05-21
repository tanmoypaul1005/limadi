/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import useCommonHomeStore, { getCommonHomeIndex } from '../../../app/stores/others/commonHomeStore.js';
import ReqListArea from './components/ReqListArea.jsx';
import TopHeader from './components/TopHeader.jsx';

const HomePage = () => {
    const { homePageData, homeReqList, setSelectedReqType } = useCommonHomeStore();
    useEffect(() => {
        setSelectedReqType(0);
        getCommonHomeIndex();
    }, []);

    return (
        <div
            onClick={() => {
                console.log('homePageData', homePageData);
                console.log('homeReqList', homeReqList);
            }}
        >
            <TopHeader />
            <ReqListArea />
        </div>
    );
};

export default HomePage;