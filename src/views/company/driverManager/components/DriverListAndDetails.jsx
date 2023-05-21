import React from 'react';
import { useEffect } from 'react';
import useDriverStore, { getDrivers, selectDriver } from '../../../../app/stores/company/driverStore';
import { iUserAvatar } from '../../../../app/utility/imageImports';
import CommonEmptyData from '../../../../components/emptyData/CommonEmptyData';
import CommonListItem from '../../../../components/listItems/CommonListItem';
import DriverDetails from './DriverDetails';

const DriverListAndDetails = () => {

    const {  driverList, selectedDriverIndex, setShowAddDriverModal } = useDriverStore();

    useEffect(() => { getDrivers() }, []);

    return (
        <div>
            {driverList?.length > 0 ?
                <div className="mt-s20 grid grid-cols-12 gap-2 md:gap-8 2xl:gap-8">
                    <div className="col-span-12 order-last lg:col-span-4 lg:order-first mt-s20 lg:mt-0">
                        <div className="flex-col">
                            {driverList?.map((item, index) => (
                                <div className='mb-s20'>
                                    <CommonListItem
                                        onClick={async () => {
                                            await selectDriver(item,index)
                                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                                        }}
                                        imgCover={true}
                                        key={index}
                                        title={item?.name ? item?.name : ''}
                                        subTitleOne={item?.email ? item?.email : ''}
                                        subTitleTwo={item?.phone_from_driver ? item?.phone_from_driver : ''}
                                        selected={selectedDriverIndex === index}
                                        withImage={true}
                                        imagePath={item?.image ? item?.image : iUserAvatar}
                                        imagePathDummy={iUserAvatar}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-8">
                        <DriverDetails />
                    </div>
                </div> : <CommonEmptyData
                    title='No Driver Found !'
                    button={false}
                    onClick={() => setShowAddDriverModal(true)}
                    details='There is no driver available now.'
                    btnLabel="Add New Driver"
                />}
        </div>
    );
};

export default DriverListAndDetails;