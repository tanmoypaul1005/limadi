import React, { useEffect, useRef } from 'react';

import useGlobalReqStore, { getGlobalRequestList } from '../../../../../app/stores/company/globlaReqStore';
import { getStringFromDateObject } from '../../../../../app/utility/utilityFunctions';
import CommonButton from '../../../../../components/button/CommonButton';
import CommonDatePicker from '../../../../../components/input/CommonDatePicker';
import CommonTimePicker from '../../../../../components/input/CommonTimePicker';
import CommonModal from '../../../../../components/modal/CommonModal';
import CommonMultiSelect from '../../../../../components/select/CommonMultiSelect';
import CommonSelect from '../../../../../components/select/CommonSelect';

const FilterGlobalRequest = () => {
    const {
        showFilterGlobalReqModal,
        setShowFilterGlobalReqModal,
        globalIndexForm,
        setGlobalIndexForm,
        resetGlobalIndexForm,
        globalReqCityList,
        globalReqTransportList,
        globalReqFilterSelectedCity,
        setGlobalReqFilterSelectedCity,
        setGlobalReqFilterSelectedTransport,
        globalReqFilterSelectedTransport,
    } = useGlobalReqStore();

    const divRef = useRef(null);

    useEffect(() => {
        if (divRef.current)
            divRef.current.focus();
    }, []);
    return (
        <CommonModal
            showModal={showFilterGlobalReqModal}
            setShowModal={setShowFilterGlobalReqModal}
            modalTitle={
                <div className='flex items-baseline'>
                    <div>Filter</div>
                    <div
                        onClick={() => {
                            setGlobalReqFilterSelectedCity([]);
                            setGlobalReqFilterSelectedTransport('');
                            resetGlobalIndexForm();
                        }}
                        className='text-cRed text-base pl-4 cursor-pointer select-none'>Clear</div>
                </div>
            }

            mainContent={
                <div
                    onClick={() => {
                        console.log('globalIndexForm: ',
                            globalIndexForm);
                    }}>

                    <div tabIndex="0" ref={divRef} className='pt-7' ></div>
                    {/* row 01 */}
                    <div className="pb-5 flex items-center space-x-5">
                        <div className="w-1/2">
                            <CommonSelect
                                label='Transportation Type'
                                value={globalReqFilterSelectedTransport}
                                dataArray={globalReqTransportList}
                                onChange={(e, title) => {
                                    console.log('transport_type: ', title);
                                    setGlobalReqFilterSelectedTransport(e.target.value);
                                    console.log('value: ', e.target.value);
                                    setGlobalIndexForm({ ...globalIndexForm, transport_type: title })
                                }}
                            />
                        </div>

                        <div className="w-1/2">
                            <CommonMultiSelect
                                label='Select City'
                                value={globalReqFilterSelectedCity}
                                dataArray={globalReqCityList}
                                onChange={(e) => {
                                    setGlobalReqFilterSelectedCity(e.target.value);
                                    setGlobalIndexForm({ ...globalIndexForm, city: e.target.value });
                                }}
                            />

                        </div>
                    </div>

                    {/* date pickers */}
                    <div className="pb-5 flex items-center space-x-5">
                        <CommonDatePicker
                            label='Pickup From'
                            value={globalIndexForm?.start_date}
                            onChange={(date) => setGlobalIndexForm({ ...globalIndexForm, start_date: getStringFromDateObject(date) })}
                        />

                        <CommonDatePicker
                            label='Pickup To'
                            value={globalIndexForm?.end_date}
                            onChange={(date) => setGlobalIndexForm({ ...globalIndexForm, end_date: getStringFromDateObject(date) })}
                        />
                    </div>


                    {/* time pickers */}
                    <div className="pb-5 flex items-center space-x-5">
                        <CommonTimePicker
                            showExtendedTimeUi={false}
                            label='Pickup From'
                            init_time={globalIndexForm?.start_time}
                            onChange={(time) => setGlobalIndexForm({ ...globalIndexForm, start_time: time })}
                        />
                        <CommonTimePicker
                            showExtendedTimeUi={false}
                            label='Pickup To'
                            init_time={globalIndexForm?.end_time}
                            onChange={(time) => setGlobalIndexForm({ ...globalIndexForm, end_time: time })}
                        />
                    </div>
                    <div className="flex flex-row-reverse">
                        <CommonButton
                            btnLabel='filter shift'
                            onClick={() => {
                                let filterSuccess = getGlobalRequestList(globalIndexForm, true, false);
                                if (filterSuccess) {
                                    setShowFilterGlobalReqModal(false);
                                }
                            }}
                        />
                    </div>
                </div>
            }
        />
    )
}

export default FilterGlobalRequest