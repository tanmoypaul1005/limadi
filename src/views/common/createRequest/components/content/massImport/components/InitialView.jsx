import React from 'react'
import useCreateRequestStore from '../../../../../../../app/stores/others/createRequestStore';
import { iMassImportTable } from '../../../../../../../app/utility/imageImports';
import CommonButton from '../../../../../../../components/button/CommonButton';


export default function InitialView() {
  const { setShowGenerateTableModal } = useCreateRequestStore();

  return (<div className='px-[60px] flex flex-col justify-center items-center py-24'>

    <img className='mb-5 opacity-30' src={iMassImportTable} alt="table" />

    <CommonButton
      onClick={() => setShowGenerateTableModal(true)}
      btnLabel={'Generate Table'}
    />

    <div className='text-cBodyText text-fs14 font-fw400 text-center'>
      For massive upload please click on <span className='text-cMainBlack text-fs14 font-fw600'>Generate Table</span> button to create a custom table as you need. The table row is fixed in <span className='text-cMainBlack text-fs14 font-fw600'> 4 COLUMN</span>. But you can add ROW’s as much as you need and can remove any ROW any time.
    </div>


  </div>)
}