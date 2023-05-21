import React from 'react';
import useFavoriteAddressStore, { deleteFavoriteAddress } from '../../../../app/stores/others/favoriteAddressStore';
import CommonButton from '../../../../components/button/CommonButton';
import CommonModal from '../../../../components/modal/CommonModal';

const FavoriteAddressDeleteModal = () => {

    const { 
        setShowFavoriteAddressDeleteModal,
         showFavoriteAddressDeleteModal,
         selectedFavoriteAddressDeleteId ,
         setSelectedFavoriteAddressDeleteId
        } = useFavoriteAddressStore();

    return (
        <div>
            <CommonModal
                showModal={showFavoriteAddressDeleteModal}
                setShowModal={setShowFavoriteAddressDeleteModal}
                modalTitle="Delete Favorite Address"
                mainContent={
                    <>
                        <div className='mt-s20 '>Are you sure you want to delete this address?</div>

                        <div className='flex justify-end mt-s20'>
                            <CommonButton onClick={async () => {
                                const successDeleteFavAddress = await deleteFavoriteAddress(selectedFavoriteAddressDeleteId);

                                if (successDeleteFavAddress) {
                                    setShowFavoriteAddressDeleteModal(false);
                                    setSelectedFavoriteAddressDeleteId("")
                                }

                            }} btnLabel='Confirm' colorType='danger' />
                        </div>
                    </>
                }
            />
        </div>
    );
};

export default FavoriteAddressDeleteModal;