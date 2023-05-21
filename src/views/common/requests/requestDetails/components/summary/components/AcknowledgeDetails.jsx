import { Rating } from '@mui/material'
import React from 'react'
import useRequestStore from '../../../../../../../app/stores/others/requestStore'
import CommonViewComponent from '../../../../../../../components/viewer/CommonViewComponent';

export default function AcknowledgeDetails() {
  const { request_details } = useRequestStore();
  return (
    <div className='mt-5'>

      {request_details?.acknowledge ? <div className='p-3  border border-cMainBlue rounded flex flex-col justify-start items-start space-y-2'>
        <div className='text-cMainBlack text-fs16 font-fw500 flex flex-row justify-between items-center w-full'>
          <div>{request_details?.is_rated ? 'Review' : 'Acknowledgement'}</div>

          {request_details?.rate && <Rating
            name="size-large"
            size="small"
            value={request_details?.rate ?? 0}
            readOnly={true}
            datatype={'number'}
          />}

        </div>

        {request_details?.is_rated ?
          <></> : <CommonViewComponent
            labelText='Company Comment'
            value={request_details?.acknowledge ?? 'NA'}
          />}

        {request_details?.is_rated ? <CommonViewComponent
          labelText='Comment'
          value={request_details?.review ?? 'NA'}
        /> : <></>}

      </div>
        :
        <div className='p-3 text-cShadeBlueGray text-fs14 font-fw400 text-center border border-cMainBlue rounded'>
          {'Company has not been acknowledged yet!'}
        </div>
      }
    </div>
  )
}
