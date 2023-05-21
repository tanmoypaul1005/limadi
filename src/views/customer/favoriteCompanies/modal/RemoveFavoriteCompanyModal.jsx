import React from 'react';
import useFavoriteCompaniesStore, { addFavoriteCompany } from '../../../../app/stores/customer/favoriteCompaniesStore';
import CommonButton from '../../../../components/button/CommonButton';
import CommonModal from '../../../../components/modal/CommonModal';

const RemoveFavoriteCompanyModal = () => {

    const { setShowRemoveFavoriteCompanyModal, showRemoveFavoriteCompanyModal,setSelectedNotFavId} = useFavoriteCompaniesStore()
    return (
        <div>
            <CommonModal
                showModal={showRemoveFavoriteCompanyModal}
                setShowModal={setShowRemoveFavoriteCompanyModal}
                modalTitle="Confirmation"
                mainContent={
                    <>
                        <div className='my-s20'>Are you sure you want to remove this company from favorite?</div>
                        <div className='flex justify-end'>
                            <CommonButton colorType="danger" btnLabel='Confirm'
                                onClick={async () => {
                                    const success = await addFavoriteCompany();
                                    if (success) {
                                        setSelectedNotFavId(null)
                                        setShowRemoveFavoriteCompanyModal(false);
                                    }
                                }} />
                        </div>
                    </>
                }
            />
        </div>
    );
};

export default RemoveFavoriteCompanyModal;