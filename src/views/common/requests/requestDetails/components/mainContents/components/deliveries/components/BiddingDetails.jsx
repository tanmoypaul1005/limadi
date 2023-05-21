import { Rating, Tooltip } from '@mui/material'
import React from 'react'
import { base_url_src } from '../../../../../../../../../app/utility/const'
import { iUserAvatar } from '../../../../../../../../../app/utility/imageImports'
import CommonViewComponent from '../../../../../../../../../components/viewer/CommonViewComponent'
import RequestDetailsTextTitle from '../../RequestDetailsTextTitle'

export default function BiddingDetails({ data }) {
  const { awarded, awarded_company } = data;

  return (
    <div className='border-cGrey border-[0.5px] p-3'>
      <div className='pt-s0'>  <RequestDetailsTextTitle title={`Bidding Details`} /> </div>

      <div className='max-h-s50 flex flex-row justify-between space-x-1 relative text-fs14 font-fw400'>
        <div className='flex flex-row justify-start space-x-2  w-[60%] relative'>
          <img className='rounded-full h-s50 w-s50 object-fill' src={awarded_company?.image ? (base_url_src + awarded_company?.image) : iUserAvatar} alt="" />

          <div className='flex flex-col justify-start items-start'>
            <div className='whitespace-nowrap overflow-clip max-w-full text-fs16 font-fw500 ml-1'>{awarded_company?.name ?? 'NA'}</div>
            <Rating
              name="size-large"
              size="medium"
              value={awarded_company?.rate ?? 0}
              readOnly={true}
              datatype={'number'}

            />

          </div>

        </div>

        <div className='flex flex-col justify-start items-start w-[40%] relative text-fs16 font-fw500'>
          <Tooltip color={'#F89818'} title={`Bidding Price : DKK ${awarded?.budget.toLocaleString("da-DK") ?? 'NA'}`} >
            <div className='whitespace-nowrap overflow-clip max-w-full'>Bidding Price : DKK {awarded?.budget?.toLocaleString("da-DK") ?? 'NA'}</div>
          </Tooltip>
        </div>
      </div>

      <CommonViewComponent
        labelText='Comment'
        value={awarded?.details}
      />

    </div>
  )
}
