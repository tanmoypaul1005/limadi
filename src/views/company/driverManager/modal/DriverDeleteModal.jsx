import React from 'react';
import useDriverStore, { deleteDriver } from '../../../../app/stores/company/driverStore';
import CommonButton from '../../../../components/button/CommonButton';
import CommonModal from '../../../../components/modal/CommonModal';

const DriverDeleteModal = () => {

    const { showDriverDeleteModal, setShowDriverDeleteModal,setSelectedDriverDeleteId } = useDriverStore();

    return (
        <div>
            <CommonModal
                showModal={showDriverDeleteModal}
                setShowModal={setShowDriverDeleteModal}
                modalTitle="Delete Driver"
                mainContent={
                    <>
                        <div className='mt-s20 '>Are you sure you want to delete this driver account?</div>

                        <div className='flex justify-end mt-s20'>
                            <CommonButton onClick={() => {
                                const success = deleteDriver();
                                if (success) {
                                    setSelectedDriverDeleteId("")
                                    setShowDriverDeleteModal(false)
                                }

                            }} btnLabel='Confirm' colorType='danger' />
                        </div>
                    </>
                }
            />
        </div>
    );
};

export default DriverDeleteModal;