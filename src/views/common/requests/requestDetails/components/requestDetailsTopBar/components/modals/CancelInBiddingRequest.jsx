import React from 'react'
import { useNavigate } from 'react-router-dom';
import useRequestStore, { deleteInBiddingRequest } from '../../../../../../../../app/stores/others/requestStore';
import CommonButton from '../../../../../../../../components/button/CommonButton';
import CommonInput from '../../../../../../../../components/input/CommonInput';
import CommonModal from '../../../../../../../../components/modal/CommonModal';

export default function CancelInBiddingRequest({ showModal, setShowModal, request_id }) {
  const navigateTo = useNavigate();
  const [comment, setComment] = React.useState('');
  const { request_details } = useRequestStore();

  const submitForm = async (e) => {
    e.preventDefault();
    const success = await deleteInBiddingRequest(request_details?.my_bid?.id, comment);
    if (success) setShowModal(false);
    navigateTo(-1);
    setComment('');
  }
  return (
    <CommonModal
      showModal={showModal}
      setShowModal={setShowModal}
      modalTitle="Delete Request"
      widthClass="w-[50vw]"
      mainContent={
        <>
          <div className='mt-s20 pb-s10'>Do you want to cancel your bid?</div>

          <form onSubmit={submitForm}>

            <CommonInput className={'my-3'} name={'comment'} value={comment} onChange={(e) => setComment(e.target.value)} labelText='Reason' textarea={true} type={'text'} max_input={255} required={true} />

            <div className='flex justify-end mt-s30'>
              <CommonButton onClick={async () => {

              }}
                btnLabel='Confirm'
                colorType='danger'
                width='w-[100px]'
                type='submit'
              />

            </div>

          </form>
        </>
      }
    />
  )
}
