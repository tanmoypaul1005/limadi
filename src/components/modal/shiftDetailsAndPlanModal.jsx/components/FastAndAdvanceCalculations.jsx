/* eslint-disable react-hooks/exhaustive-deps */
import { t } from 'i18next';
import React, { useEffect } from 'react'
import { useParams } from 'react-router';
import useRequestStore, { getAdvanceCalculationData, getFastCalculationData } from '../../../../app/stores/others/requestStore'
import { calculateDistance, calculateTime } from '../../../../app/utility/utilityFunctions';

export default function FastAndAdvanceCalculations({ shift_id, p_request_id }) {
  const { is_fast_calculation, setIsFastCalculation, fastCalculationData, advanceCalculationData } = useRequestStore();
  const params = useParams();
  let { request_id } = params;
  request_id = request_id ?? p_request_id;

  useEffect(() => {
    setIsFastCalculation(true);
    getFastCalculationData(request_id);
  }, [])


  return (
    <div className='w-full  flex-col justify-start items-start  space-y-7'>

      <div className='flex flex-row w-full items-start justify-between space-x-3'>
        <CalculationButton label={'Fast Calculation'} selected={is_fast_calculation} onClick={() => {
          setIsFastCalculation(true);
          getFastCalculationData(request_id);
        }} />
        <CalculationButton label={'Advance Calculation'} selected={is_fast_calculation ? false : true} onClick={() => {
          setIsFastCalculation(false);
          getAdvanceCalculationData(request_id, shift_id);
        }} />
      </div>

      <div className='flex flex-row justify-between space-x-3'>

        <div className='text-fs14 font-fw400 text-cGrey flex flex-col justify-start space-y-2'>
          <div>Distance</div>
          <div className='title'>
            {is_fast_calculation ? <> {calculateDistance(fastCalculationData?.distance).distance} {t(calculateDistance(fastCalculationData?.distance).unit) ?? 'NA'} </>
              : <> {calculateDistance(advanceCalculationData?.distance).distance} {t(calculateDistance(advanceCalculationData?.distance).unit) ?? 'NA'} </>}
          </div>
        </div>


        <div className='text-fs14 font-fw400 text-cGrey flex flex-col justify-start items-end space-y-2'>
          <div>Duration</div>
          <div className='title'>
            {is_fast_calculation ? <>
              {calculateTime(fastCalculationData?.time).time} {t(calculateTime(fastCalculationData?.time).unit) ?? 'NA'}
            </>
              :
              <>
                {calculateTime(advanceCalculationData?.duration).time} {t(calculateTime(advanceCalculationData?.duration).unit) ?? 'NA'}
              </>}
          </div>
        </div>

      </div>

    </div>
  )
}

const CalculationButton = ({ label, onClick, selected = false }) => {
  return (
    <div
      onClick={onClick}
      className={`cp h-s44 w-auto px-2 py-2 text-s16 font-fw500 text-center rounded border hover:text-cMainBlack hover:border-cMainBlack ${selected ? 'border-cMainBlue text-cMainBlue' : 'text-cMainBlack border-cTextButtonHover'}`}>
      {label}
    </div>
  )
}
