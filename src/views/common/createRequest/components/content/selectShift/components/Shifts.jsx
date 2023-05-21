/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import useCreateRequestStore from '../../../../../../../app/stores/others/createRequestStore';
import useRequestStore, { getShiftDetails } from '../../../../../../../app/stores/others/requestStore';
import { base_url_src, create_request_steps } from '../../../../../../../app/utility/const';
import { iUserAvatar } from '../../../../../../../app/utility/imageImports';
import { formatDate, formatTime } from '../../../../../../../app/utility/utilityFunctions';
import CommonEmptyData from '../../../../../../../components/emptyData/CommonEmptyData';
import CommonListItem from '../../../../../../../components/listItems/CommonListItem';
import ShiftDetailsModal from './ShiftDetailsModal';

export default function Shifts() {

  const { available_shifts } = useRequestStore();
  const { changeCrForm, cr_form, current_step } = useCreateRequestStore();
  const [selected_shift_index, setSelectedShiftIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    console.log('here1',);
    if (current_step === create_request_steps.select_shift && !cr_form?.shift_id) {
      console.log('here2',);
      changeCrForm('shift_plan', available_shifts[0]);
      changeCrForm('shift_id', available_shifts[0]?.id);
    }

    if (available_shifts.length === 0) {
      changeCrForm('shift_plan', null);
      changeCrForm('shift_id', null);
    }
  }, [available_shifts])


  return (
    <div className='my-3'>

      <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-4 xl:grid-cols-2 2xl:grid-cols-3 gap-y-4'>

        {available_shifts.map((item, index) => (
          <CommonListItem
            key={index}
            title={item?.driver_user?.name}
            subTitleOne={item?.car?.car_license_plate_number}
            subTitleTwo={`Schedule on ${formatDate(item?.start_date)}, ${formatTime(item?.start_time)} - ${formatTime(item?.end_time)}`}
            iconNormal={item?.driver_user?.image ? (base_url_src + item?.driver_user?.image) : iUserAvatar}
            iconSelected={item?.driver_user?.image ? (base_url_src + item?.driver_user?.image) : iUserAvatar}
            imgCover={true}
            selected={item?.id === cr_form?.shift_id}
            onClick={() => {
              setShowModal(true);
              setSelectedShiftIndex(index);
              changeCrForm('shift_plan', item);
              changeCrForm('shift_id', item?.id);
              getShiftDetails(item?.id)

              console.log('selected_index', selected_shift_index, item);
            }}
          />
        ))}


      </div>

      {
        available_shifts?.length === 0 ? <CommonEmptyData title='No Shift Available!' details='No Shift Available to Plan!' /> : <></>
      }

      {<ShiftDetailsModal showModal={showModal} setShowModal={setShowModal} selected_shift_index={selected_shift_index} />}
    </div>
  )
}
