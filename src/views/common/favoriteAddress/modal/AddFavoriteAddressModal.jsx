import React, { useState } from 'react';
import useFavoriteAddressStore, { addFavoriteAddress } from '../../../../app/stores/others/favoriteAddressStore';
import CommonButton from '../../../../components/button/CommonButton';
import AddressAutoComplete from '../../../../components/input/AddressAutoComplete';
import CommonInput from '../../../../components/input/CommonInput';
import CommonModal from '../../../../components/modal/CommonModal';

const AddFavoriteAddressModal = () => {

    const {
        setShowAddFavoriteAddressModal,
        setAddFavoriteAddress_form,
        showAddFavoriteAddressModal,
        addFavoriteAddress_form
    } = useFavoriteAddressStore();

    const [doSearch, setDoSearch] = useState(false);
    const [addAddressLabel, setAddAddressLabel] = useState("");
    const [lat, setLet] = useState("");

    const submitAddFavoriteAddressForm = async (e) => {
        e.preventDefault();
        await setAddFavoriteAddress_form({ ...addFavoriteAddress_form, address: addAddressLabel, lat: lat });

        const successAddFavoriteAddress = await addFavoriteAddress();
        if (successAddFavoriteAddress) {
            setShowAddFavoriteAddressModal(false)
            setAddFavoriteAddress_form({
                title: "",
                address: "",
                note: "",
                lng: "",
                lat: "",
            })
            setAddAddressLabel("");
            setLet("");
        }
    }

    const handleChange = async (name, value) => {
        if (name === "address") {
            await setAddAddressLabel(value);
        } else if (name === "lat") {
            await setLet(value)
        } else if (name === "lng") {
            await setAddFavoriteAddress_form({ ...addFavoriteAddress_form, lng: value });
        }
    };

    return (
        <div>
            <CommonModal
                showModal={showAddFavoriteAddressModal}
                setShowModal={setShowAddFavoriteAddressModal}
                modalTitle="Add New Favorite Address"
                mainContent={
                    <>
                        <div className='mt-s22'>
                            <form onSubmit={submitAddFavoriteAddressForm}>
                                <div className='mb-s7'>
                                    <CommonInput
                                        min={'1'}
                                        type='text'
                                        labelText='Address Title'
                                        required={true}
                                        value={addFavoriteAddress_form?.title}
                                        name={'title'}
                                        onChange={(e) => {
                                            setAddFavoriteAddress_form({ ...addFavoriteAddress_form, title: e.target.value })
                                        }} />
                                </div>
                                <div className='mb-s20'>
                                    <AddressAutoComplete
                                        required={true}
                                        label={("Address")}
                                        placeholder={("Type Address..")}
                                        name={"address"}
                                        address={addAddressLabel}
                                        latName={"lat"}
                                        lngName={"lng"}
                                        changeValue={handleChange}
                                        doSearch={doSearch}
                                        setDoSearch={setDoSearch}
                                        icon={false}
                                    />

                                </div>
                                <div className=''>
                                    <CommonInput type='text'
                                        textarea={true}
                                        max_input={'255'}
                                        value={addFavoriteAddress_form?.note}
                                        name={'note'}
                                        rows={'2'}
                                        labelText='Note'
                                        onChange={(e) => {
                                            setAddFavoriteAddress_form({ ...addFavoriteAddress_form, note: e.target.value })
                                        }}
                                    />
                                </div>

                                <div className='flex justify-end mt-s25'>
                                    <CommonButton
                                        type='submit'
                                        btnLabel='Add'
                                        width="w-[100px]"
                                        isDisabled={
                                            addFavoriteAddress_form?.title &&
                                                addFavoriteAddress_form?.lng && lat
                                                && addAddressLabel ? false : true
                                        }


                                    />
                                </div>
                            </form>
                        </div>
                    </>
                }

            />
        </div>
    );
};

export default AddFavoriteAddressModal;