import React, { } from 'react';
import { useNavigate } from 'react-router-dom';
import { declineRequestInvitation } from '../../../../../../../../app/stores/others/requestStore';
import CommonButton from '../../../../../../../../components/button/CommonButton';
import CommonInput from '../../../../../../../../components/input/CommonInput';
import CommonModal from '../../../../../../../../components/modal/CommonModal';

const DeclineInvitationConfirmModal = ({ request_id, showModal, setShowModal }) => {
  const navigateTo = useNavigate();
  const [comment, setComment] = React.useState('');

  const submitForm = async (e) => {
    e.preventDefault();
    const success = await declineRequestInvitation(request_id, comment);
    if (success) setShowModal(false);
    navigateTo(-1);
    setComment('');
  }

  return (
    <div>
      <CommonModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalTitle="Decline Invitation"
        widthClass="w-[50vw]"
        mainContent={
          <>
            <div className='mt-s20 pb-s10'>Do you want to decline this invitation?</div>

            <form onSubmit={submitForm}>

              <CommonInput className={'my-3'} name={'comment'} value={comment} onChange={(e) => setComment(e.target.value)} labelText='Decline Reason' textarea={true} type={'text'} max_input={255} required={true} />

              <div className='flex justify-end mt-s30'>
                <CommonButton onClick={async () => {

                }}
                  btnLabel='Decline'
                  colorType='danger'
                  width='w-[100px]'
                  type='submit'
                />

              </div>
            </form>
          </>
        }
      />
    </div>
  );
};

export default DeclineInvitationConfirmModal;