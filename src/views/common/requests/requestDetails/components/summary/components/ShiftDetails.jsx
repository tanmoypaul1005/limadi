import React, { useState } from 'react'
import useRequestStore from '../../../../../../../app/stores/others/requestStore'
import { base_url_src } from '../../../../../../../app/utility/const';
import { iUserAvatar } from '../../../../../../../app/utility/imageImports'
import { formatDate, formatTime } from '../../../../../../../app/utility/utilityFunctions';
import ShiftDetailsAndPlanModal from '../../../../../../../components/modal/shiftDetailsAndPlanModal.jsx/ShiftDetailsAndPlanModal';

export default function ShiftDetails({ request_id }) {
  const { request_details } = useRequestStore();
  const { driver, shift_plan } = request_details;

  const start_time = request_details?.pickup_start_time;
  const start_date = request_details?.pickup_date;
  const [show_plan_tool_modal, setShowPlanToolModal] = useState(false);

  return (
    <div className='mt-5'>
      <div className='text-cMainBlack text-fs16 font-fw500 mb-4'>Shift Details</div>

      <div className='border border-cMainBlue w-full rounded p-3 flex flex-row justify-start items-center space-x-3 relative'>
        <img className='h-12 w-12 rounded-full' src={driver?.image ? (base_url_src + driver?.image) : iUserAvatar} alt="" srcset="" />

        <div className='flex flex-col justify-start items-start space-y-0 text-fs12 font-fw400'>
          <div className='text-fs16 font-fw500'> {driver?.name ?? 'NA'} </div>
          <div> {request_details?.car_license_number ?? 'NA'} </div>
          <div> {(formatDate(shift_plan?.start_date) ?? '--') + ', ' + (formatTime(shift_plan?.start_time) ?? '00') + ' - ' + (formatTime(shift_plan?.end_time) ?? '00')} </div>

        </div>

        {request_details?.awarded?.status === 'init' && <div onClick={() => setShowPlanToolModal(true)} className='text-cMainBlue text-fs12 font-fw500 cp absolute right-3 top-3' >Edit</div>}
      </div>

      {(start_time && start_date) && <ShiftDetailsAndPlanModal
        title='Plan Tool'
        showModal={show_plan_tool_modal}
        setShowModal={setShowPlanToolModal}
        start_time={start_time}
        start_date={start_date}
        request_id={request_id}
        set_plan={true}
        selected_shift_id={shift_plan?.id}
      />}
    </div>
  )
}
