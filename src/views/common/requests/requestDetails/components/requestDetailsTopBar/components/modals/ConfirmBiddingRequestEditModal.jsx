import React from 'react'
import CommonModal from '../../../../../../../../components/modal/CommonModal'
import CommonButton from '../../../../../../../../components/button/CommonButton'

export default function ConfirmBiddingRequestEditModal({ showModal, setShowModal, onConfirm }) {
  return (
    <CommonModal
      showModal={showModal}
      setShowModal={setShowModal}
      modalTitle="Edit Request"
      widthClass="w-[35vw]"
      mainContent={
        <>
          <div className='mt-s20 '>Do you want to edit this request?</div>

          <div className='flex justify-end mt-s20'>
            <CommonButton onClick={onConfirm} btnLabel='Confirm' width='w-[100px]' />
          </div>
        </>
      }
    />
  )
}
