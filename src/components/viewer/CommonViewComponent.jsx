import React from 'react'
import { iBottomArrow } from '../../app/utility/imageImports'

const CommonViewComponent = ({
  onClick = () => { },
  labelText = 'some label',
  value = 'NA',
  underline = false,
  className = '',
  selectComponent = false,
  disabled = false,
}) => {
  return (
    selectComponent ?
      <div onClick={onClick} className='pt-0 w-full h-[35px] text-sm'>
        <div className='flex items-center justify-between'>
          <div className={`capitalize ${disabled ? "text-[#939699]" : ""} `}>{labelText}</div>
          <img src={iBottomArrow} alt="" className='w-3 h-3' />
        </div>
        <div className="mt-1.5 w-full h-s1 bg-[#757575]"></div>
      </div>
      :
      <div onClick={onClick} className={`flex flex-col justify-end  ${underline ? 'w-full' : 'w-fit'} ${className}`}>
        <div className='capitalize text-xs font-medium text-[#89919E]'>{labelText}</div>
        <div className='py-0 '>{value ?? 'NA'}</div>
        {underline ? <div className="w-full h-s1 bg-[#757575]"></div> : ''}
      </div>
  )
}

export default CommonViewComponent