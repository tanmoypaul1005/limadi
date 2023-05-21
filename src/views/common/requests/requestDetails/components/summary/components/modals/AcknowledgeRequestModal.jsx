import React, { } from 'react';
import { useNavigate } from 'react-router-dom';
import { acknowledgeRequest } from '../../../../../../../../app/stores/others/requestStore';
import CommonButton from '../../../../../../../../components/button/CommonButton';
import CommonInput from '../../../../../../../../components/input/CommonInput';
import CommonModal from '../../../../../../../../components/modal/CommonModal';

const AcknowledgeRequestModal = ({ request_id, showModal, setShowModal }) => {
  const navigateTo = useNavigate();
  const [comment, setComment] = React.useState('');

  const submitForm = async (e) => {
    e.preventDefault();
    const success = await acknowledgeRequest(request_id, comment);
    if (success) setShowModal(false);
    navigateTo(-1);
    setComment('');
  }

  return (
    <div>
      <CommonModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalTitle="Acknowledgement Request"
        widthClass="w-[50vw]"
        mainContent={
          <>

            <form onSubmit={submitForm}>

              <CommonInput className={'my-3'} name={'comment'} value={comment} onChange={(e) => setComment(e.target.value)} labelText='Comment' textarea={true} type={'text'} max_input={255} required={true} />

              <div className='flex justify-end mt-s30'>
                <CommonButton
                  btnLabel='Submit'
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

export default AcknowledgeRequestModal;