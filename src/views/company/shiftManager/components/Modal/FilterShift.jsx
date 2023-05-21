import React from 'react';
import useShiftStore, { getAllShiftList } from '../../../../../app/stores/company/shiftStore';
import { getStringFromDateObject, removeEmpty } from '../../../../../app/utility/utilityFunctions';
import CommonButton from '../../../../../components/button/CommonButton';
import CommonCheckbox from '../../../../../components/input/CommonCheckbox';
import CommonDatePicker from '../../../../../components/input/CommonDatePicker';
import CommonTimePicker from '../../../../../components/input/CommonTimePicker';
import CommonModal from '../../../../../components/modal/CommonModal';
import CommonSelect from '../../../../../components/select/CommonSelect';

const FilterShift = () => {
    const {
        showFilterShiftModal,
        setShowFilterShiftModal,
        filterShiftList,
        setFilterShiftList,
        filterShiftCarList,
        filterShiftDriverList,
        selectedDriver,
        setSelectedDriver,
        setShiftFilterMode,
    } = useShiftStore();

    return (
        <div>
            <CommonModal
                showModal={showFilterShiftModal}
                setShowModal={setShowFilterShiftModal}
                modalTitle={
                    <div className='flex items-baseline'>
                        <div>{'filter shift'}</div>
                        <div
                            onClick={() => {
                                console.log("CLEARING FILTERS WITHOUT SEARCH BOX .....");
                                setShiftFilterMode(false);

                                setSelectedDriver(''); //as we are maintaining the driver value separately from the main filter object
                                setFilterShiftList({
                                    start_date: null,
                                    start_time: null,
                                    end_date: null,
                                    end_time: null,
                                    plate_number: "",
                                    driver_name: "",
                                    is_maintenance: null,
                                    search: filterShiftList?.search,
                                });
                                // setShiftFilterMode(false);
                            }}
                            className='cursor-pointer select-none drop-shadow-sm text-base text-cRed pl-4'>Clear</div>
                    </div>
                }
                mainContent={
                    <form
                        onClick={() => {
                            // console.log('car list', allShiftCarList);
                            // console.log('driver list', allShiftDriverList);
                            console.log('filterShiftList', filterShiftList);
                        }}
                        onSubmit={(e) => e.preventDefault()}>

                        {/* date pickers */}
                        <div className="pt-5 grid grid-cols-2 items-center gap-7">
                            <CommonDatePicker
                                value={filterShiftList?.start_date}
                                onChange={(date) => { setFilterShiftList({ ...filterShiftList, start_date: getStringFromDateObject(date) }) }}
                                label='start date'
                            />

                            <CommonDatePicker
                                // disabled={filterShiftList?.start_date ? false : true}
                                startDate={filterShiftList?.start_date}
                                value={filterShiftList?.end_date}
                                onChange={(date) => { setFilterShiftList({ ...filterShiftList, end_date: getStringFromDateObject(date) }) }}
                                label='end date'
                            />
                        </div>

                        {/* time pickers */}
                        <div className="pt-[26px] grid grid-cols-2 items-center gap-7">
                            <CommonTimePicker init_time={filterShiftList?.start_time} onChange={(date) => { setFilterShiftList({ ...filterShiftList, start_time: date }) }} showExtendedTimeUi={false} label='start time' />
                            <CommonTimePicker init_time={filterShiftList?.end_time} onChange={(date) => { setFilterShiftList({ ...filterShiftList, end_time: date }) }} showExtendedTimeUi={false} label='end time' />
                        </div>

                        {/*b        select dropdowns */}
                        <div className="pt-4 grid grid-cols-2 items-center gap-7">

                            <CommonSelect
                                subTitle={filterShiftCarList?.length > 0 ? 'select car / license plate' : 'No car found'}
                                value={filterShiftList?.plate_number}
                                onChange={(e, title) => {

                                    console.log('selected car', e, ', title: ', title);

                                    setFilterShiftList({ ...filterShiftList, plate_number: e.target.value });
                                }}
                                label='select car / license plate'
                                dataArray={filterShiftCarList}
                            />

                            <CommonSelect
                                value={selectedDriver}
                                onChange={(e, title) => {

                                    console.log('selected driver', e.target.value, ', title: ', title);
                                    setSelectedDriver(e.target.value);
                                    setFilterShiftList({ ...filterShiftList, driver_name: title })
                                }}
                                label='select driver'
                                subTitle={filterShiftDriverList?.length > 0 ? 'select driver' : 'No driver found'}
                                dataArray={filterShiftDriverList}
                            />
                        </div>

                        {/* status and maintenance state selection */}
                        <div className="pt-[35px] flex items-baseline justify-between space-x-7 cursor-pointer select-none w-full">

                            <CommonSelect
                                value={filterShiftList?.status}
                                onChange={(e, title) => {
                                    console.log('selected status', e.target.value, ', title: ', title);
                                    if (e.target.value === 'complete')
                                        setFilterShiftList({ ...filterShiftList, status: e.target.value, type: "history" });
                                    else if (e.target.value === 'init')
                                        setFilterShiftList({ ...filterShiftList, status: e.target.value, is_maintenance: false, is_maintenance_req: true });
                                    else
                                        setFilterShiftList({ ...filterShiftList, status: e.target.value, type: "" });
                                }}

                                label='shift status'
                                dataArray={[
                                    { title: 'Not started', value: 'init' },
                                    { title: 'Ongoing', value: 'ongoing' },
                                    { title: 'Completed', value: 'complete' },
                                ]}
                            />
                            <div className="w-full relative">
                                <div className="absolute -top-[9px]">
                                    <CommonCheckbox
                                        label='in maintenance'
                                        checked={filterShiftList?.is_maintenance ? true : false}
                                        onChange={() => {
                                            setFilterShiftList({ ...filterShiftList, is_maintenance: filterShiftList?.is_maintenance ? null : 'In Maintenance' });
                                        }} />
                                </div>
                            </div>

                        </div>

                        {/* submit form */}
                        <div className="pt-5 flex flex-row-reverse">
                            <CommonButton
                                type='submit'
                                btnLabel='filter shift'
                                onClick={async () => {
                                    // return 
                                    console.log('filter shift data: ', filterShiftList);

                                    setFilterShiftList(removeEmpty(filterShiftList));

                                    if (
                                        filterShiftList?.start_date ||
                                        filterShiftList?.start_time ||
                                        filterShiftList?.end_date ||
                                        filterShiftList?.end_time ||
                                        filterShiftList?.plate_number ||
                                        filterShiftList?.driver_name ||
                                        filterShiftList?.status ||
                                        filterShiftList?.type ||
                                        filterShiftList?.is_maintenance_req ||
                                        filterShiftList?.is_maintenance) {
                                        setShiftFilterMode(true);
                                    } else {
                                        setShiftFilterMode(false);
                                        console.log('Object is empty');
                                    }
                                    let filterSuccess = await getAllShiftList(filterShiftList);
                                    if (filterSuccess)
                                        setShowFilterShiftModal(false);



                                }}
                            />
                        </div>
                    </form>
                }
            />
        </div>
    )
}

export default FilterShift