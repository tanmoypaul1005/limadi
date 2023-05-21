/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useRequestStore, { assignNotPlannedRequestShift, getRequestShiftPlannerList } from '../../../app/stores/others/requestStore'
import CommonButton from '../../button/CommonButton'
import CommonEmptyData from '../../emptyData/CommonEmptyData'
import CommonModal from '../CommonModal'
import FastAndAdvanceCalculations from './components/FastAndAdvanceCalculations'
import Shifts from './components/Shifts'
import ShiftSummary from './components/ShiftSummary'
import Stops from './components/Stops'

export default function ShiftDetailsAndPlanModal({ title = 'Shift Details', showModal, setShowModal, start_time, start_date, set_plan = false, request_id = null, selected_shift_id }) {

  const { available_shifts, selected_shift_index, is_fast_calculation } = useRequestStore();
  const navigateTo = useNavigate();

  useEffect(() => {
    showModal && getRequestShiftPlannerList(start_time, start_date);
  }, [showModal]);



  return (
    <>
      <CommonModal
        heightMax='max-h-[calc(100vh-30px)]'
        showModal={showModal}
        setShowModal={setShowModal}
        modalTitle={title}
        widthClass='w-[65vw] max-w-[670px]'
        mainContent={
          <div className='pr-1 max-h-[calc(100vh-160px)] overflow-y-auto'>

            {
              available_shifts?.length > 0 ?
                <div className='my-5'><Shifts available_shifts={available_shifts} selected_shift_id={selected_shift_id} /> </div>
                :
                <CommonEmptyData title='No Shift Available!' details='No Shift Available to Plan!' />
            }


            {
              (selected_shift_index !== null) &&
              <div className='w-full relative flex flex-col items-start  space-y-7  pl-1'>
                <ShiftSummary />
                <FastAndAdvanceCalculations shift_id={available_shifts[selected_shift_index]?.id} />
              </div>
            }


            {!is_fast_calculation && <Stops />}

            {set_plan && <div className='flex flex-row justify-end mt-5'>
              <CommonButton
                btnLabel='Submit'
                isDisabled={selected_shift_index !== null ? false : true}
                onClick={async () => {
                  let success = await assignNotPlannedRequestShift(request_id, available_shifts[selected_shift_index]?.id);
                  if (success) {
                    setShowModal(false);
                    navigateTo(-1);
                  }

                }}
              />
            </div>}

          </div>
        }
      />
    </>

  )
}
