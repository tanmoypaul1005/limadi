import React from 'react'
import { base_url_src } from '../../../../../../../../../app/utility/const'
import { iUserAvatar } from '../../../../../../../../../app/utility/imageImports'
import RequestDetailsTextTitle from '../../RequestDetailsTextTitle'

export default function CustomerProfile({ data }) {
  return (
    <div className='border-cGrey border-[0.5px] p-3'>
      <div className='pb-s8'>  <RequestDetailsTextTitle title={`Customer Profile`} /> </div>

      <div className=' flex flex-row justify-between space-x-4 relative text-fs14 font-fw400'>
        <div className='flex flex-row justify-start space-x-3  w-full relative items-center'>
          <img className='rounded-full  object-cover h-s60 w-s60' src={data?.image ? (base_url_src + data?.image) : iUserAvatar} alt="" />

          <div className='flex flex-col justify-start items-start'>
            <div className='whitespace-nowrap overflow-clip max-w-full text-fs16 font-fw500'>{data?.name ?? 'NA'}</div>

            <div className='whitespace-nowrap overflow-clip max-w-full'>{data?.email ?? 'NA'}</div>

            <div className='whitespace-nowrap overflow-clip max-w-full'>{data?.phone ?? 'NA'}</div>
          </div>

        </div>

      </div>
    </div>
  )
}
