import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSettingsStore, { deleteUserAccount } from '../../../../../app/stores/others/settingsStore';
import CommonButton from '../../../../../components/button/CommonButton';
import CommonModal from '../../../../../components/modal/CommonModal';

const DeleteAccountModal = () => {

    const { showDeleteAccountModal, setShowDeleteAccountModal } = useSettingsStore();
    const navigateTo=useNavigate()

    return (
        <div>
            <CommonModal
                showModal={showDeleteAccountModal}
                setShowModal={setShowDeleteAccountModal}
                modalTitle="Delete Account"
                widthClass="w-[35vw]"
                mainContent={
                    <>
                        <div className='mt-s20 '>Are you sure, you want to permanently delete this account ?</div>

                        <div className='flex justify-end mt-s20'>

                            <CommonButton onClick={async() => {
                                const success =await deleteUserAccount();
                                if (success) {
                                    setShowDeleteAccountModal(false)
                                    navigateTo("/login")
                                }
                            }} btnLabel='Delete' colorType='danger' width='w-[100px]' />
                        </div>
                    </>
                }
            />
        </div>
    );
};

export default DeleteAccountModal;