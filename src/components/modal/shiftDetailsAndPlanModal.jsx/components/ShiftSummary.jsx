/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import useRequestStore from '../../../../app/stores/others/requestStore'
import { formatDate, formatTime } from '../../../../app/utility/utilityFunctions';
import SummaryInfoItem from '../../../utility/summary/components/SummaryInfoItem';

export default function ShiftSummary() {
  const { shift_details } = useRequestStore();

  return (
    <div className='w-full mt-1'>
      <div className='sub-title'>{'Shift Summary'}</div>

      <div className='w-full py-s10 flex flex-col justify-start space-y-[6px]'>
        <SummaryInfoItem title='Start In' description={shift_details?.starts_in} />
        <SummaryInfoItem title='Start Date' description={formatDate(shift_details?.start_date)} />
        <SummaryInfoItem title='Start Time' description={formatTime(shift_details?.start_time)} />
      </div>
    </div>
  )
}
