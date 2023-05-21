import React, { useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import useCarStore, { getAllCar, searchCarList } from '../../../app/stores/company/carStore';
import { iWhitePlus } from '../../../app/utility/imageImports';
import { changePageTitle } from '../../../app/utility/utilityFunctions';
import CommonButton from '../../../components/button/CommonButton';
import CommonSearchBox from '../../../components/input/CommonSearchBox';
import CommonTopTitleSection from '../../../components/title/CommonTopTitleSection';
import CarList from './components/CarList';


const CarManagement = () => {

    const { setShowAddCarModal, allCarList, carSearchKey, setCarSearchKey, setCarDetails, setSelectedCarIndex } = useCarStore();
    const [searchDebouncedValue] = useDebounce(carSearchKey, 500);

    useEffect(() => {
        changePageTitle('Limadi | Car Manager');
    }, [])

    useEffect(() => {
        if (searchDebouncedValue) {
            searchCarList(searchDebouncedValue);
        } else {
            getAllCar(false);
        }

    }, [searchDebouncedValue]);

    return (
        <div>
            <div className=''>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:flex-wrap md:flex-nowrap'>

                    <CommonTopTitleSection title="Car Manager" counter={allCarList?.length ?? 0} withReloader={true} onReload={() => getAllCar()} />

                    <div className='flex flex-col md:flex-row md:justify-between  mt-s16 md:mt-0'>

                        <CommonSearchBox

                            placeholder="Search Car"
                            onChange={(e) => {
                                setCarDetails(null);
                                setSelectedCarIndex(null);
                                setCarSearchKey(e.target.value);
                            }}
                            value={carSearchKey}
                        />

                        <div className='mt-s16 md:-mt-0 md:ml-s10'><CommonButton
                            onClick={() => { setShowAddCarModal(true) }}
                            btnLabel='Add Car'
                            icon={iWhitePlus}
                            width="w-[120px]" /></div>
                    </div>
                </div>
                <CarList />
            </div>

        </div>
    );
};

export default CarManagement;