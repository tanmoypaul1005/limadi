import React from 'react';
import useCarStore, { addCar, getAllCar } from '../../../../app/stores/company/carStore';
import { iCar } from '../../../../app/utility/imageImports';
import CommonButton from '../../../../components/button/CommonButton';
import ProfileImageUploader from '../../../../components/imageUpload/ProfileImageUploader';
import CommonInput from '../../../../components/input/CommonInput';
import CommonModal from '../../../../components/modal/CommonModal';

const AddCarModal = () => {

    const {
        showAddCarModal,
        setShowAddCarModal,
        setShowCarLicensePackageModal,
        addCarForm,
        setAddCarForm,
        resetAddCarForm,
        setShowCarLicenseSkip,
    } = useCarStore();

    return (
        <div>
            <CommonModal
                showModal={showAddCarModal}
                setShowModal={setShowAddCarModal}
                modalTitle="Add New Car"
                mainContent={
                    <>
                        <div className='mt-s20'>
                            <div className='flex justify-center mb-s20'>
                                <ProfileImageUploader
                                    width='w-[160px]'
                                    height='h-[160px]'
                                    dummyImage={iCar}
                                    onChange={(e) => console.log('image uploader onChange: ', e)}
                                    finalBase64={(e) => setAddCarForm({ ...addCarForm, image: e })}
                                />
                            </div>
                            <form onSubmit={(e) => e.preventDefault()} className='col-span-12 lg:col-span-10'>
                                <div className='grid grid-cols-12 gap-6 md:gap-5 2xl:gap-5 mb-s20'>
                                    <div className='col-span-6'><CommonInput
                                        labelText='Car Name'
                                        value={addCarForm?.name}
                                        name={'name'}
                                        type='text'
                                        required={true}
                                        onChange={(e) => { setAddCarForm({ ...addCarForm, name: e.target.value }) }}
                                    /></div>

                                    <div className='col-span-6'>
                                        <CommonInput
                                            labelText='Car License Plate Number'
                                            value={addCarForm?.car_license_plate_number}
                                            max_input={9}
                                            name={'license'}
                                            required={true}
                                            onChange={(e) => { setAddCarForm({ ...addCarForm, car_license_plate_number: e.target.value }) }}
                                        /></div>
                                </div>

                                <div className=''>
                                    <CommonInput
                                        textarea={true}
                                        // rows={2}
                                        // max_input={255}
                                        labelText='Car Specification'
                                        value={addCarForm?.comment}
                                        name={'details'}
                                        required={true}
                                        onChange={(e) => { setAddCarForm({ ...addCarForm, comment: e.target.value }) }} />
                                </div>

                                <div className='flex justify-end items-center space-x-4 mt-12'>
                                    <div className=''>
                                        <CommonButton
                                            type='submit'
                                            onClick={async () => {
                                                let addSuccess = false;
                                                if (addCarForm?.name && addCarForm?.car_license_plate_number && addCarForm?.comment) {
                                                    addSuccess = await addCar(addCarForm, addCarForm?.image ? true : false);
                                                } else return;

                                                if (addSuccess) {
                                                    await getAllCar();
                                                    resetAddCarForm();
                                                    setShowAddCarModal(false);
                                                    setShowCarLicenseSkip(true);
                                                    setShowCarLicensePackageModal(true);
                                                }
                                            }}
                                            colorType={(addCarForm?.name && addCarForm?.car_license_plate_number && addCarForm?.comment) ? "primary" : "disable"}
                                            isDisabled={!(addCarForm?.name && addCarForm?.car_license_plate_number && addCarForm?.comment) ? true : false}
                                            // icon={iWhitePlus}
                                            btnLabel='Save & Continue'
                                            width='w-[160px]'
                                        /></div>
                                </div>
                            </form>
                        </div>
                    </>
                }
            />
        </div>
    );
};

export default AddCarModal;