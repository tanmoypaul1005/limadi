/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import useShiftStore, {
  addNewShift,
  getAllShiftCarsAndDriversList
} from "../../../../../app/stores/company/shiftStore";
import { checkPastTime, getStringFromDateObject, Toastr } from "../../../../../app/utility/utilityFunctions";
import CommonButton from "../../../../../components/button/CommonButton";
import CommonCheckbox from "../../../../../components/input/CommonCheckbox";
import CommonDatePicker from "../../../../../components/input/CommonDatePicker";
import CommonInput from "../../../../../components/input/CommonInput";
import CommonTimePicker from "../../../../../components/input/CommonTimePicker";
import CommonModal from "../../../../../components/modal/CommonModal";
import CommonSelect from "../../../../../components/select/CommonSelect";
import CommonViewComponent from "../../../../../components/viewer/CommonViewComponent";

const AddShift = () => {
  const {
    showAddShiftModal,
    setShowAddShiftModal,
    addShiftForm,
    setAddShiftForm,
    setAllShiftCarList,
    setAllShiftDriverList,
    resetAddShiftForm,
    allShiftCarList,
    allShiftDriverList,
  } = useShiftStore();

  const [carDriverChooseMode, setCarDriverChooseMode] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const resetCarDriverData = () => {
    setAllShiftCarList([]);
    setAllShiftDriverList([]);
    // setAddShiftForm({...addShiftForm, car_id: null, car_license_plate_number:"", driver_user_id:""});
  }

  // b    time validation 
  const isTimeValid = (startTime, endTime, startDate = addShiftForm?.start_date, endDate = addShiftForm?.end_date) => {
    // Combine the start date and time into a single Date object
    const startDateTime = new Date(startDate + 'T' + startTime);

    // Combine the end date and time into a single Date object
    const endDateTime = new Date(endDate + 'T' + endTime);

    // Check if the start date/time is before the end date/time  
    return startDateTime < endDateTime;

  }

  const fetchCarAndDrivers = async () => {
    let validatedTime = await isTimeValid(addShiftForm?.start_time, addShiftForm?.end_time);

    if (addShiftForm?.is_maintenance) {
      if (validatedTime) {
        //the loading can be removed from here by sending false as 5th parameter to load the data silently
        getAllShiftCarsAndDriversList(addShiftForm?.start_date, addShiftForm?.end_date, addShiftForm?.start_time, addShiftForm?.end_time, true);
      } else return;
      // Toastr({ message: "End time should be greater than start time" });

    } else {
      if (validatedTime) {
        //the loading can be removed from here by sending false as 5th parameter to load the data silently
        getAllShiftCarsAndDriversList(addShiftForm?.start_date, addShiftForm?.end_date, addShiftForm?.start_time, addShiftForm?.end_time, true);
      } else return;
      //   Toastr({ message: "End time should be greater than start time" });
    }
  };


  useEffect(() => {
    localStorage.setItem('add_shift_driver_user_id', 0);
    localStorage.setItem('add_shift_comment', '');
  }, []);

  useEffect(() => {
    if (addShiftForm?.is_maintenance && addShiftForm?.start_date && addShiftForm?.end_date && addShiftForm?.start_time && addShiftForm?.end_time) {
      setCarDriverChooseMode(true);
      // fetchCarAndDrivers();
      if (addShiftForm?.car_id && addShiftForm?.car_license_plate_number) setCanSubmit(true);
      else setCanSubmit(false);
    }
    else if (!addShiftForm?.is_maintenance && addShiftForm?.start_date && addShiftForm?.start_time && addShiftForm?.end_time) {
      setCarDriverChooseMode(true);
      // fetchCarAndDrivers();
      if (addShiftForm?.car_id && addShiftForm?.car_license_plate_number && addShiftForm?.driver_user_id) setCanSubmit(true);
      else setCanSubmit(false);
    }
    else setCarDriverChooseMode(false);

  }, [addShiftForm]);


  useEffect(() => {
    let local_comment = localStorage.getItem('add_shift_comment');
    let local_driver_user_id = localStorage.getItem('add_shift_driver_user_id');

    if (addShiftForm?.is_maintenance) {
      setAddShiftForm({ ...addShiftForm, comment: "", driver_user_id: null });
    } else {

      // check if new end date is required
      let validTimeValues = isTimeValid(addShiftForm?.end_time, addShiftForm?.start_time, addShiftForm?.start_date, addShiftForm?.start_date);

      if (!validTimeValues) {
        let end_date_next = addShiftForm?.start_date ? new Date(addShiftForm?.start_date) : null;
        console.log('222 end_date_next : ', end_date_next);
        end_date_next?.setDate(end_date_next?.getDate() + 1);
        setAddShiftForm({ ...addShiftForm, comment: local_comment, driver_user_id: local_driver_user_id > 0 ? parseInt(local_driver_user_id) : null, end_date: end_date_next });
      } else
        setAddShiftForm({ ...addShiftForm, comment: local_comment, driver_user_id: local_driver_user_id > 0 ? parseInt(local_driver_user_id) : null, end_date: addShiftForm?.start_date });
    }
  }, [addShiftForm?.is_maintenance]);

  return (
    <div>
      <CommonModal
        showModal={showAddShiftModal}
        setShowModal={setShowAddShiftModal}
        modalTitle={
          <div className='flex items-baseline'>
            <div>add shift</div>
            <div
              onClick={() => {
                setAddShiftForm({});
              }}
              className='cursor-pointer select-none drop-shadow-sm text-base text-cRed pl-4'>Clear</div>
          </div>
        }
        mainContent={
          <form
            onClick={() => {
              console.log('addShiftForm: ', addShiftForm);
              console.log('allShiftCarList: ', allShiftCarList);
              console.log('allShiftDriverList: ', allShiftDriverList);
            }}
            onSubmit={(e) => e.preventDefault()}>
            {/* maintenance state selection */}
            <div className="pt-5 flex items-center space-x-2.5 cursor-pointer select-none w-fit">
              <CommonCheckbox
                label="in maintenance"
                checked={addShiftForm?.is_maintenance}
                onChange={() =>
                  setAddShiftForm({ ...addShiftForm, is_maintenance: !addShiftForm?.is_maintenance })
                }
              />
            </div>

            {/*e       date pickers */}
            <div className="pt-5 grid grid-cols-2 items-center gap-7">
              <CommonDatePicker
                label="start date"
                required={true}
                allowPastDate={false}
                value={addShiftForm?.start_date}
                onChange={(date) => {
                  resetCarDriverData();
                  if (!addShiftForm?.is_maintenance)
                    setAddShiftForm({ ...addShiftForm, start_date: getStringFromDateObject(date), end_date: getStringFromDateObject(date), car_id: null, car_license_plate_number: "", driver_user_id: "" });
                  else
                    setAddShiftForm({ ...addShiftForm, start_date: getStringFromDateObject(date), car_id: null, car_license_plate_number: "", driver_user_id: "" });
                }}
              />
              {
                addShiftForm?.is_maintenance ? (
                  <CommonDatePicker
                    disabled={addShiftForm?.start_date ? false : true}
                    label="end date"
                    required={addShiftForm?.is_maintenance}
                    startDate={getStringFromDateObject(addShiftForm?.start_date)}
                    value={addShiftForm?.end_date}
                    onChange={(date) => {
                      resetCarDriverData();
                      // if (addShiftForm?.start_time && addShiftForm?.end_time) {
                      //   if (isStartTimeAfterEndTime(addShiftForm?.start_time, addShiftForm?.end_time) && !addShiftForm?.is_maintenance) {
                      //     setAddShiftForm({ ...addShiftForm, end_time: null });
                      //   }
                      // }
                      setAddShiftForm({ ...addShiftForm, end_date: getStringFromDateObject(date), car_id: null, car_license_plate_number: "", driver_user_id: "" });
                    }}
                  />
                ) : (
                  <div></div>
                )}
            </div>

            {/*p     time pickers */}
            <div className="pt-[26px] grid grid-cols-2 items-center gap-7">
              <CommonTimePicker
                disabled={addShiftForm?.start_date ? false : true}
                required={true}
                showExtendedTimeUi={false}
                label="start time"
                init_time={addShiftForm?.start_time}
                onChange={(time) => {
                  resetCarDriverData();
                  setAddShiftForm({ ...addShiftForm, start_time: time, car_id: null, car_license_plate_number: "", driver_user_id: "" });
                }}
              />


              <CommonTimePicker
                required={true}
                disabled={addShiftForm?.start_date ? false : true}
                showExtendedTimeUi={false}
                label="end time"
                init_time={addShiftForm?.end_time}
                onChange={(time) => {
                  resetCarDriverData();
                  console.log("CHANGED !");

                  if (!isTimeValid(addShiftForm?.start_time, time)) {
                    let start_date_next = addShiftForm?.start_date ? new Date(addShiftForm?.start_date) : null;
                    start_date_next?.setDate(start_date_next?.getDate() + 1);

                    setAddShiftForm({ ...addShiftForm, end_time: time, end_date: getStringFromDateObject(start_date_next ?? new Date()), car_id: null, car_license_plate_number: "", driver_user_id: "" });
                    console.log('88888 auto generating end_date', addShiftForm);

                    console.log('88888 new end_date DONE: ', getStringFromDateObject(start_date_next));
                  } else {
                    console.log('88888 valid timing, no date change required !');
                    if (isTimeValid(addShiftForm?.start_time, time, addShiftForm?.start_date, addShiftForm?.start_date))
                      setAddShiftForm({ ...addShiftForm, end_time: time, end_date: addShiftForm?.start_date, car_id: null, car_license_plate_number: "", driver_user_id: "" });
                    else
                      setAddShiftForm({ ...addShiftForm, end_time: time, car_id: null, car_license_plate_number: "", driver_user_id: "" });
                  }
                }}
              />
            </div>

            {/*v           dropdowns          */}
            <div
              onClick={() => {
                if (!allShiftCarList?.length || !allShiftDriverList?.length) fetchCarAndDrivers();
              }}
              className={`pt-4 grid grid-cols-2 items-center gap-7 h-[72px]`}
            >
              {(!allShiftCarList?.length || !allShiftDriverList?.length) ?
                <>

                  <div className="pt-[21px]">
                    <CommonViewComponent
                      selectComponent={true}
                      disabled={true}
                      labelText="select car / license plate"
                    />
                  </div>
                  <div className="pt-[21px]">
                    <CommonViewComponent
                      selectComponent={true}
                      disabled={true}
                      labelText="select driver"
                    />
                  </div>

                </>
                :
                <>
                  <CommonSelect
                    // open={open}
                    disabled={carDriverChooseMode ? false : true}
                    required={true}
                    label="select car / license plate"
                    dataArray={allShiftCarList}
                    value={addShiftForm?.car_license_plate_number}
                    onChange={(e) => {
                      let car_id_found = allShiftCarList.find((car) => car.value === e.target.value);
                      console.log('car_id_found', car_id_found?.id);
                      setAddShiftForm({ ...addShiftForm, car_id: parseInt(car_id_found?.id), car_license_plate_number: e.target.value });
                    }}
                  />

                  <CommonSelect
                    disabled={!addShiftForm?.is_maintenance && carDriverChooseMode ? false : true}
                    required={!addShiftForm?.is_maintenance}
                    label="select driver"
                    dataArray={allShiftDriverList}
                    value={addShiftForm?.is_maintenance ? null : addShiftForm?.driver_user_id}
                    onChange={(e) => {
                      localStorage.setItem('add_shift_driver_user_id', e.target.value);
                      setAddShiftForm({ ...addShiftForm, driver_user_id: e.target.value });
                    }}
                  />
                </>
              }
            </div>

            {/*g    comments  */}
            <div className="pt-5">
              <CommonInput
                disabled={addShiftForm?.is_maintenance}
                required={!addShiftForm?.is_maintenance}
                textarea={true}
                labelText="Shift Instruction"
                value={addShiftForm?.is_maintenance ? '' : addShiftForm?.comment}
                onChange={(e) => {
                  localStorage.setItem('add_shift_comment', e.target.value);
                  setAddShiftForm({ ...addShiftForm, comment: e.target.value });
                }}
              />
            </div>

            {/* submit form */}
            <div className="pt-10 flex flex-row-reverse">
              <CommonButton
                type="submit"
                isDisabled={!canSubmit}
                btnLabel="add shift"
                onClick={async () => {
                  console.log("add shift form", addShiftForm);

                  // time validations.
                  if (checkPastTime(addShiftForm?.start_time, addShiftForm?.start_date)) return Toastr({ message: "Start Time: Past Time not allowed." });

                  // if (!isTimeValid(addShiftForm?.start_time, addShiftForm?.end_time)) {
                  //   Toastr({ message: "End time should be greater than start time" });
                  //   return;
                  // }

                  if (addShiftForm?.start_date && addShiftForm?.end_date && addShiftForm?.start_time && addShiftForm?.end_time) {
                    if (addShiftForm?.is_maintenance) {
                      let addSuccess = await addNewShift(addShiftForm);
                      if (addSuccess) {
                        resetAddShiftForm();
                        setShowAddShiftModal(false);
                      }
                    } else if (!addShiftForm?.is_maintenance && addShiftForm?.car_license_plate_number && addShiftForm?.driver_user_id && addShiftForm?.comment) {
                      let addSuccess = await addNewShift(addShiftForm);
                      if (addSuccess) {
                        localStorage.setItem('add_shift_driver_user_id', 0);
                        localStorage.setItem('add_shift_comment', '');
                        resetAddShiftForm();
                        setShowAddShiftModal(false);
                      }
                    }

                  }
                }}
              />
            </div>
          </form>
        }
      />
    </div>
  );
};

export default AddShift;
