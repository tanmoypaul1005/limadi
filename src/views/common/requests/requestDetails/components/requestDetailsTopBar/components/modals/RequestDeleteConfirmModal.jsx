import React, { } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteRequest } from '../../../../../../../../app/stores/others/requestStore';
import CommonButton from '../../../../../../../../components/button/CommonButton';
import CommonModal from '../../../../../../../../components/modal/CommonModal';

const RequestDeleteConfirmModal = ({ request_id, showModal, setShowModal }) => {
  const navigateTo = useNavigate();


  return (
    <>
      <CommonModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalTitle="Delete Request"
        widthClass="w-[50vw]"
        mainContent={
          <>
            <div className='mt-s20 '>Do you want to delete this request?</div>

            <div className='flex justify-end mt-s20'>

              <CommonButton onClick={async () => {
                const success = await deleteRequest(request_id);
                if (success) setShowModal(false);
                navigateTo(-1);
              }}
                btnLabel='Delete'
                colorType='danger'
                width='w-[100px]'
              />

            </div>
          </>
        }
      />
    </>
  );
};

export default RequestDeleteConfirmModal;