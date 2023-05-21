import React from 'react';
import useShiftStore from '../../../../app/stores/company/shiftStore';
import { formatDate, formatTimeHourMinutes } from '../../../../app/utility/utilityFunctions';
import SecondaryTitle from '../../../../components/title/SecondaryTitle';

//todo:: use summary component
const ShiftSummary = () => {
  const { shiftDetailsData } = useShiftStore();
  return (
    <>
      <SecondaryTitle title='summary' />
      <div className='w-[400px] bg-cCommonListBG p-2.5 space-y-2'>
        <SummaryItem title='driver name' data={shiftDetailsData?.driver_user?.name} />
        <SummaryItem title='license plate' data={shiftDetailsData?.car?.car_license_plate_number} />
        <SummaryItem title='start date' data={formatDate(shiftDetailsData?.start_date)} />
        <SummaryItem title='end date' data={formatDate(shiftDetailsData?.end_date)} />
        <SummaryItem title='start time' data={formatTimeHourMinutes(shiftDetailsData?.start_time ? shiftDetailsData?.start_time : "00:00:00") + ' - ' + formatTimeHourMinutes(shiftDetailsData?.end_time ? shiftDetailsData?.end_time : "00:00:00")} />
        <SummaryItem title='requests' data={(shiftDetailsData?.length ?? 0) + ' requests'} />
        <SummaryItem title='stops' data={(shiftDetailsData?.stops_count ?? 0) + ' stops'} />
        <SummaryItem title='packages' data={(shiftDetailsData?.products_count ?? 0) + ' packages'} />

        {/* <div>
          <div className='font-medium'>Shift Instructions</div>
          <div className='text-xs'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam pariatur maxime nostrum architecto cupiditate mollitia beatae ea culpa id minima. Labore, dicta neque et quas iusto odit perferendis ullam quae?</div>
        </div> */}
      </div>
    </>
  )
}

export default ShiftSummary

const SummaryItem = ({ title = '', data = '' }) => {
  return (
    <div className='w-full flex items-center justify-between text-xs capitalize'>
      <div>{title}</div>
      <div className='font-semibold '>{data}</div>
    </div>
  )
}