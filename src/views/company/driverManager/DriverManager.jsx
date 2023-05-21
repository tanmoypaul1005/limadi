/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useEffect } from 'react';
import useDriverStore, { getDrivers, searchDriver } from '../../../app/stores/company/driverStore';
import { iWhitePlus } from '../../../app/utility/imageImports';
import { changePageTitle } from '../../../app/utility/utilityFunctions';
import CommonButton from '../../../components/button/CommonButton';
import CommonSearchBox from '../../../components/input/CommonSearchBox';
import CommonTitle from '../../../components/title/CommonTitle';
import { useDebounce } from 'use-debounce';
import DriverListAndDetails from './components/DriverListAndDetails';

const DriverManager = () => {

    const { setShowAddDriverModal, driverList, driverSearchValue, setDriverSearchValue } = useDriverStore();

    const [searchValue] = useDebounce(driverSearchValue, 500);

    useEffect(() => {
        changePageTitle("Limadi | Driver Manager")
        setDriverSearchValue("")
    }, [])

    useEffect(() => {
        searchDriver(searchValue)
    }, [searchValue])

    return (
        <div>
            <div className=''>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:flex-wrap md:flex-nowrap'>
                    <CommonTitle
                        withReloader={true}
                        onReload={async () => {
                            await setDriverSearchValue("")
                            await getDrivers();
                        }}
                        title="Driver Manager" count={driverList?.length} />
                    <div className='flex flex-col md:flex-row md:justify-between mt-s16 md:mt-0'>
                        <CommonSearchBox
                            onChange={(e) => { setDriverSearchValue(e.target.value) }}
                            name="searchKey"
                            value={driverSearchValue}
                        />
                        <div className='mt-s16 md:mt-0 md:ml-s10 '>
                            <CommonButton
                                onClick={() => { setShowAddDriverModal(true) }}
                                btnLabel='Add Driver'
                                icon={iWhitePlus}
                                width="w-[140px]" /></div>
                    </div>
                </div>

                <DriverListAndDetails />
            </div>
        </div>
    );
};

export default DriverManager;