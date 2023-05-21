import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore, { getNotification, notificationSeenFn } from '../../../app/stores/others/notificationStore';
import NotificationDropdownItem from './NotificationDropdownItem';

const NotificationDropdown = () => {

    const { notificationList, setNotificationDropDownOpen, setShowNotificationDetailsModal, setNotificationDetails } = useNotificationStore();

    const navigateTo = useNavigate();

    useEffect(() => {
        getNotification()
    }, [])

    return (
        <div>
            {<div className="p-s15 overflow-y-auto max-h-screen scroll-smooth bg-white shadow-lg rounded-br10">
                <div className="flex justify-between">
                    <div className="text-cMainBlack text-fs28 font-fw500">Notification</div>

                    <div className="cursor-pointer text-sm flex justify-center items-center">
                        {notificationList?.length > 0 &&
                            <div
                                onClick={() => {
                                    setNotificationDropDownOpen(false)
                                    navigateTo("/notification");
                                }}
                                className='text-cBrand text-fs16 font-fw500 no-underline'>
                                See all
                            </div>}
                    </div>
                </div>

                <div className='w-full'>
                    {notificationList?.length > 0 ? notificationList?.slice(0, 5)?.map((item, index) => (
                        <div key={index}>
                            <div className='mt-s20'>
                                <NotificationDropdownItem
                                    onClick={() => {
                                        notificationSeenFn(item?.id);
                                        setNotificationDetails(item);
                                        setShowNotificationDetailsModal(true)
                                    }}
                                    seen={item?.is_seen}
                                    title={item?.title}
                                    details={item?.description}
                                    date={item?.created_date}
                                    time={item?.created_time}
                                />
                            </div>
                            {notificationList[4]?.id !== item.id && <div className='my-s10'><hr></hr></div>}
                        </div>
                    )) : <div className='py-s40 flex justify-center items-center'>
                        <span>Nothing in Notification !</span>
                    </div>}


                </div>
            </div>}
        </div>
    );
};

export default NotificationDropdown;