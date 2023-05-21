import React, { useEffect } from 'react';
import useShiftStore, { updateShift } from '../../../../../app/stores/company/shiftStore';
import { formatTimeHourMinutes, getStringFromDateObject } from '../../../../../app/utility/utilityFunctions';
import CommonButton from '../../../../../components/button/CommonButton';
import CommonCheckbox from '../../../../../components/input/CommonCheckbox';
import CommonDatePicker from '../../../../../components/input/CommonDatePicker';
import CommonInput from '../../../../../components/input/CommonInput';
import CommonTimePicker from '../../../../../components/input/CommonTimePicker';
import CommonModal from '../../../../../components/modal/CommonModal';
import CommonSelect from '../../../../../components/select/CommonSelect';

const EditShift = () => {
    // const [inMaintenanceState, setInMaintenanceState] = useState(false);
    const {
        showEditShiftModal,
        setShowEditShiftModal,
        shiftUpdateData,
        setShiftUpdateData,
        allShiftDriverList,

        allShiftCarList,
        shiftDetailsData,
    } = useShiftStore();


    // b    date/time validation 
    const isTimeValid = (startTime, endTime, startDate = shiftUpdateData?.start_date, endDate = shiftUpdateData?.end_date) => {
        // Combine the start date and time into a single Date object
        const startDateTime = new Date(startDate + 'T' + startTime);

        // Combine the end date and time into a single Date object
        const endDateTime = new Date(endDate + 'T' + endTime);

        // Check if the start date/time is before the end date/time  
        return startDateTime < endDateTime;
    }

    useEffect(() => {
        if (parseInt(shiftUpdateData?.is_maintenance))
            setShiftUpdateData({ ...shiftUpdateData, comment: "", driver_user_id: null });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shiftUpdateData?.is_maintenance]);

    useEffect(() => {
        if (showEditShiftModal)
            setShiftUpdateData({
                id: shiftDetailsData?.id,
                driver_user_id: shiftDetailsData?.driver_user_id,
                car_id: shiftDetailsData?.car_id,
                car_license_plate_number: shiftDetailsData?.car?.car_license_plate_number,
                start_date: shiftDetailsData?.start_date,
                end_date: shiftDetailsData?.end_date,

                start_time: formatTimeHourMinutes(shiftDetailsData?.start_time),
                end_time: formatTimeHourMinutes(shiftDetailsData?.end_time),

                comment: shiftDetailsData?.comment,
                is_maintenance: shiftDetailsData?.is_maintenance,
            });
    }, [showEditShiftModal]);

    return (
        <div>
            <CommonModal
                showModal={showEditShiftModal}
                setShowModal={setShowEditShiftModal}
                modalTitle={'edit shift'}
                mainContent={
                    <form
                        onClick={() => {
                            // console.log('shiftUpdateData : ', shiftUpdateData);
                            // console.log('shiftDetailsData : ', shiftDetailsData);
                            // console.log('allShiftCarList : ', allShiftCarList);
                            // console.log('allShiftDriverList : ', allShiftDriverList);

                        }}
                        onSubmit={(e) => e.preventDefault()}
                    >

                        {/*l         maintenance state selection */}
                        <div className="py-5 flex items-center space-x-2.5 cursor-pointer select-none w-fit">
                            <CommonCheckbox
                                label='in maintenance'
                                checked={parseInt(shiftUpdateData?.is_maintenance) === 1 ? true : false}
                                onChange={() => setShiftUpdateData({ ...shiftUpdateData, is_maintenance: parseInt(shiftUpdateData?.is_maintenance) === 0 ? "1" : "0" })}
                            />
                        </div>

                        {/*e      date pickers */}
                        <div className="pb-[26px] grid grid-cols-2 items-center gap-7">
                            <CommonDatePicker
                                label='start date'
                                required={true}
                                value={shiftUpdateData?.start_date}
                                onChange={(date) => {
                                    if (isTimeValid(shiftUpdateData?.start_time, shiftUpdateData?.end_time, getStringFromDateObject(date), shiftUpdateData?.end_date))
                                        setShiftUpdateData({ ...shiftUpdateData, start_date: date });
                                    else
                                        setShiftUpdateData({ ...shiftUpdateData, start_date: getStringFromDateObject(date), end_date: getStringFromDateObject(date) })
                                }}

                            />
                            {
                                parseInt(shiftUpdateData?.is_maintenance) ?
                                    <CommonDatePicker
                                        label='end date'
                                        required={parseInt(shiftUpdateData?.is_maintenance) ? true : false}
                                        value={shiftUpdateData?.end_date}
                                        onChange={(date) => setShiftUpdateData({ ...shiftUpdateData, end_date: getStringFromDateObject(date) })}
                                    />
                                    : <div></div>}
                        </div>

                        {/*p      time pickers */}
                        <div className="pb-[15px] grid grid-cols-2 items-center gap-7">
                            <CommonTimePicker
                                showExtendedTimeUi={false}
                                label='start time'
                                required={true}
                                init_time={formatTimeHourMinutes(shiftUpdateData?.start_time)}
                                onChange={(time) => setShiftUpdateData({ ...shiftUpdateData, start_time: time })}
                            />
                            <CommonTimePicker
                                showExtendedTimeUi={false}
                                required={true}
                                label='end time'
                                init_time={formatTimeHourMinutes(shiftUpdateData?.end_time)}
                                onChange={(time) => setShiftUpdateData({ ...shiftUpdateData, end_time: time })}
                            />
                        </div>

                        {/*b             dropdowns */}
                        <div className="pb-8 grid grid-cols-2 items-center gap-7">
                            <CommonSelect
                                showExtendedTimeUi={false}
                                label='select car / license plate'
                                dataArray={allShiftCarList}
                                required={true}
                                value={shiftUpdateData?.car_license_plate_number}
                                onChange={(e) => {
                                    let car_id_found = allShiftCarList?.find((car) => car?.value === e.target.value);
                                    console.log('car_id_found', car_id_found?.id);
                                    setShiftUpdateData({ ...shiftUpdateData, car_id: parseInt(car_id_found?.id), car_license_plate_number: e.target.value });
                                }}
                            />

                            <CommonSelect
                                showExtendedTimeUi={false}
                                label='select driver'
                                disabled={parseInt(shiftUpdateData?.is_maintenance) ? true : false}
                                required={parseInt(shiftUpdateData?.is_maintenance) ? false : true}
                                dataArray={allShiftDriverList}
                                value={shiftUpdateData?.driver_user_id}
                                onChange={(e) => setShiftUpdateData({ ...shiftUpdateData, driver_user_id: e.target.value })}
                            />
                        </div>

                        {/*g         textarea */}
                        <div className="">
                            <CommonInput
                                textarea={true}
                                labelText='shift instruction'
                                disabled={parseInt(shiftUpdateData?.is_maintenance) ? true : false}
                                required={parseInt(shiftUpdateData?.is_maintenance) ? false : true}
                                value={shiftUpdateData?.comment ?? ""}
                                onChange={(e) => setShiftUpdateData({ ...shiftUpdateData, comment: e.target.value })}
                            />
                        </div>

                        {/*y         submit form */}
                        <div className="pt-10 flex flex-row-reverse">
                            <CommonButton
                                type='submit'
                                btnLabel='save changes'
                                onClick={async () => {
                                    console.log('shiftUpdateData : ', shiftUpdateData);
                                    let updateSuccess;

                                    if (shiftUpdateData?.start_date && shiftUpdateData?.end_date && shiftUpdateData?.start_time && shiftUpdateData?.end_time && shiftUpdateData?.car_license_plate_number) {
                                        if (parseInt(shiftUpdateData?.is_maintenance) !== 1 && shiftUpdateData?.driver_user_id && shiftUpdateData?.comment)
                                            updateSuccess = await updateShift(shiftUpdateData, shiftDetailsData?.id);
                                        else if (parseInt(shiftUpdateData?.is_maintenance) === 1)
                                            updateSuccess = await updateShift(shiftUpdateData, shiftDetailsData?.id);
                                    }

                                    // updateSuccess = await updateShift(shiftUpdateData, shiftDetailsData?.id);

                                    if (updateSuccess) {
                                        setShowEditShiftModal(false);
                                    }
                                }} />
                        </div>
                    </form>
                }
            />
        </div>
    )
}

export default EditShift