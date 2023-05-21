import React from 'react';
import { logout } from '../../app/stores/others/authStore';
import useUtilityStore from '../../app/stores/others/utilityStore';
import CommonButton from '../button/CommonButton';
import CommonModal from './CommonModal';

const LogoutModal = () => {

    const { showLogoutModal, setShowLogoutModal } = useUtilityStore();

    return (
        <div>
            <CommonModal
                showModal={showLogoutModal}
                setShowModal={setShowLogoutModal}
                modalTitle="Log Out"
                widthClass="w-[35vw]"
                mainContent={
                    <>
                        <div className='mt-s20 '>Do you want to Log out?</div>

                        <div className='flex justify-end mt-s20'>
                            {/* <CommonButton onClick={() => {
                                setShowLogoutModal(false)
                            }} btnLabel='No' width='w-[100px]' /> */}

                            <CommonButton onClick={() => {
                                const success = logout()
                                if (success) {
                                    setShowLogoutModal(false)
                                }
                            }} btnLabel='Logout' colorType='danger' width='w-[100px]' />
                        </div>
                    </>
                }
            />
        </div>
    );
};

export default LogoutModal;