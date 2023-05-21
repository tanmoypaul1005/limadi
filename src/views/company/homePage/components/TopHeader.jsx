/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCommonHomeStore from '../../../../app//stores/others/commonHomeStore';
import { iBlackCross, iFullScreen, iRightArrowVector } from '../../../../app/utility/imageImports';
import CommonHomePageCard from '../../../../components/card/CommonHomePageCard';
import LimadiMap from '../../../../components/map/LimadiMap';
import MapModal from '../../../../components/map/MapModal';
import useMapStore, { addMarker } from '../../../../app/stores/company/mapStore';
import useGeneralStore from '../../../../app/stores/others/generalStore';

const TopHeader = () => {
    const [request, setRequest] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const navigateTo = useNavigate();
    const [companyLatLng, setCompanyLatLng] = useState([]);
    const { map } = useMapStore();
    const { isOnline } = useGeneralStore();

    const { homePageData, homeReqList, home_location_points } = useCommonHomeStore();

    const [topbarData, setTopbarData] = useState({
        title: '',
        link: "",
    });

    const selectCard = (index, path) => {
        navigateTo(path);
    }

    const handleBarClick = (linkFlow = true) => {
        if (linkFlow)
            navigateTo(topbarData?.link);
        else
            setRequest(false);
    }

    useEffect(() => {
        if (!homePageData?.is_profile_completed)
            setTopbarData({ title: 'Add an Address', link: '/settings' });
        else if (!homePageData?.is_place_bid)
            setTopbarData({ title: 'Place your first bid', link: '/global-request' });
        else if (!homePageData?.is_create_request)
            setTopbarData({ title: 'Create your first request', link: '/request/create' });
        else
            setTopbarData({ title: '', link: '' });
    }, [homePageData]);

    useEffect(() => {
        setCompanyLatLng(home_location_points)
    }, [home_location_points])

    useEffect(() => {
        isOnline && map && addMarker(companyLatLng);
        console.log("companyLatLng", companyLatLng);
    }, [companyLatLng, map, isOnline]);

    return (
        <div
            onClick={() => {
                // console.log('homePageData', homePageData);
                // console.log('homeReqList', homeReqList);
            }}
        >
            {topbarData?.title && request ?
                <div className=' rounded-br8 flex justify-between z-10 overflow-hidden cursor-pointer'>
                    <div onClick={() => { handleBarClick(true) }} className='pl-s15 w-full flex items-center py-s10 bg-cLightSkyBlue'>
                        <span className='capitalize text-fs16 font-fw500 text-cCustomerBlack'>{topbarData?.title}</span>
                        <img src={iRightArrowVector} alt="" className='w-s28 ml-s15' />
                    </div>
                    <img onClick={() => { handleBarClick(false) }} src={iBlackCross} alt="" className='bg-cLightSkyBlue px-3 z-50' />
                </div>
                : ""
            }


            {/* Home PageCard start */}

            <div className={`title ${topbarData?.title && request ? 'my-6' : 'mb-6'}`}>Home</div>

            <div className='items-center flex flex-col md:flex-row w-full'>

                <div className='w-full md:w-1/3 h-[262px] mb-s20 md:mb-0 md:mr-s20 relative'>
                    <LimadiMap />

                    <img onClick={() => setShowModal(true)} src={iFullScreen} alt="" srcset="" className='absolute top-2 right-2 cursor-pointer h-5 w-5' />
                </div>

                <div className='w-full md:w-1/7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-4 lg:gap-4 xl:gap-5 2xl:gap-5'>

                    <CommonHomePageCard
                        onClick={() => {
                            selectCard(0, "/requests/in-bidding");
                        }}
                        title="In Bidding"
                        count={homePageData?.in_bidding_count ?? 0}
                    />



                    <CommonHomePageCard
                        onClick={() => {
                            selectCard(1, "/requests/invitation");
                        }}
                        title="Invitation"
                        count={homePageData?.invitation_count ?? 0}
                    />



                    <CommonHomePageCard
                        onClick={() => {
                            selectCard(2, "/requests/not-planned");
                        }}
                        title="Not Planned"
                        count={homePageData?.awarded_not_planned_count ?? 0}
                    />



                    <CommonHomePageCard
                        onClick={() => {
                            selectCard(3, "/requests/on-going");
                        }}
                        title="Ongoing"
                        count={homePageData?.ongoing_count ?? 0}
                    />



                    <CommonHomePageCard
                        onClick={() => {
                            selectCard(4, "/requests/completed");
                        }}
                        title="Completed"
                        count={homePageData?.compete_count ?? 0}
                    />



                    <CommonHomePageCard
                        onClick={() => {
                            selectCard(5, "/global-request");
                        }}
                        title="Global Request"
                        count={homePageData?.global_count ?? 0}
                    />


                </div>
            </div>
            {/* Home PageCard end */}

            <MapModal showModal={showModal} setShowModal={setShowModal} />
        </div>
    );
};

export default TopHeader;