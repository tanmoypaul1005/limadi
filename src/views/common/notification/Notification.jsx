/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import useNotificationStore, { getNotification, searchNotifications, selectNotification } from '../../../app/stores/others/notificationStore';
import useUtilityStore from '../../../app/stores/others/utilityStore';
import { iGrayNotification, iWiteNotification } from '../../../app/utility/imageImports';
import { formatDate, changePageTitle } from '../../../app/utility/utilityFunctions';
import CommonEmptyData from '../../../components/emptyData/CommonEmptyData';
import CommonSearchBox from '../../../components/input/CommonSearchBox';
import CommonListItem from '../../../components/listItems/CommonListItem';
import CommonTitle from '../../../components/title/CommonTitle';
import NotificationDetails from './NotificationDetails';

const Notification = () => {

    const { notificationList, selectedIndex, searchKey, selectedNotification, setSearchKey } = useNotificationStore();

    const { isLoading } = useUtilityStore()

    useEffect(() => {
        setSearchKey("")
        changePageTitle("Limadi | Notification");
        getNotification()
    }, [])

    const [searchValue] = useDebounce(searchKey, 500);

    useEffect(() => {
        searchNotifications(searchValue)
    }, [searchValue])

    return (
        <div>
            <div className=''>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:flex-wrap md:flex-nowrap'>
                    <CommonTitle withReloader={true} onReload={async () => {
                        await setSearchKey("")
                        await getNotification()
                    }} title="Notification" count={notificationList?.length} icon={true} link={-1} />
                    <div className='mt-s16 sm:mt-0'>
                        <CommonSearchBox
                            onChange={(e) => { setSearchKey(e.target.value) }}
                            name="searchKey"
                            value={searchKey}
                        />
                    </div>
                </div>

                {notificationList?.length > 0 ? <div className="mt-s20 grid grid-cols-12 gap-2 md:gap-8 2xl:gap-8">
                    <div className="col-span-12 order-last lg:col-span-4 lg:order-first mt-s20 lg:mt-0">
                        <div className="flex-col space-y-5">

                            {notificationList.map((item, index) => (
                                <div key={index} className=''>
                                    <CommonListItem
                                        onClick={async () => {
                                            await selectNotification(index, item.is_seen);
                                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                                        }}
                                        seen={item?.is_seen}
                                        selected={selectedIndex === index}
                                        iconSelected={iWiteNotification}
                                        iconNormal={iGrayNotification}
                                        title={item?.title}
                                        subTitleOne={item?.description}
                                        subTitleTwo={`${formatDate(item?.created_date)} , ${item?.created_time}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-8">
                        {/* //todo:: remove skeleton*/}
                        <div className="">
                            {isLoading ? "Nothing in Notification" : <NotificationDetails selectedNotification={selectedNotification} />}
                        </div>
                    </div>
                </div>
                    : <CommonEmptyData
                        title='Nothing in Notification'
                        button={false}
                        details="You have nothing in notification list."

                    />}

            </div>
        </div>
    );
};

export default Notification;