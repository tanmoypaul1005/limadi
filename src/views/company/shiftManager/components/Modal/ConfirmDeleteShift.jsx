import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import useShiftStore, { deleteShift } from '../../../../../app/stores/company/shiftStore'
import CommonButton from '../../../../../components/button/CommonButton';
import CommonModal from '../../../../../components/modal/CommonModal'

const ConfirmDeleteShift = () => {
    const { showDeleteShiftModal, setShowDeleteShiftModal } = useShiftStore();
    const { shift_id } = useParams();

    const navigateTo = useNavigate();
    return (
        <div>
            <CommonModal
                showModal={showDeleteShiftModal}
                setShowModal={setShowDeleteShiftModal}
                modalTitle={'delete shift'}
                mainContent={
                    <>
                        <div className="pt-5">
                            Are you sure you want to delete this shift?
                        </div>

                        <div className="pt-5 flex flex-row-reverse">
                            <CommonButton
                                colorType='danger'
                                btnLabel='delete' onClick={async () => {
                                    let delSuccess = await deleteShift(shift_id);
                                    if (delSuccess) {
                                        navigateTo('/shift-manager');
                                        setShowDeleteShiftModal(false);
                                    }
                                }} />
                        </div>
                    </>
                }
            />
        </div>
    )
}

export default ConfirmDeleteShift