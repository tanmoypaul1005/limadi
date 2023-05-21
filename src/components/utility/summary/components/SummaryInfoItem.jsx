import React from 'react'

export default function SummaryInfoItem({ title = 'NA', description = 'NA', className, onClick }) {
  return (
    <div className='flex flex-row justify-between items-center text-cMainBlack w-full my-[2px] space-x-4'>
      <div className='text-sm font-fw400 overflow-clip whitespace-nowrap w-full'>{title}</div>
      <div title={description} onClick={onClick} className={`text-sm font-fw600 overflow-clip whitespace-nowrap text-right truncate w-full ${className}`}>{description ?? 'NA'}</div>
    </div>
  )
}
