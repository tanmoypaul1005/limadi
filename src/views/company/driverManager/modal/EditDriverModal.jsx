import React from 'react'
import { useEffect } from 'react';
import useDriverStore, { editDriver } from '../../../../app/stores/company/driverStore'
import CommonButton from '../../../../components/button/CommonButton';
import CommonInput from '../../../../components/input/CommonInput';
import CommonModal from '../../../../components/modal/CommonModal';

function EditDriverModal() {

    const { showEditDriverModal, setShowEditDriverModal, changeEditDriverForm, editDriver_form, driverDetails, setEditDriver_form } = useDriverStore();

    const submitEditDriverForm = async (e) => {
        e.preventDefault();
        const success = await editDriver();
        if (success) {
            setShowEditDriverModal(false);
        }
    }

    useEffect(() => {
        setEditDriver_form({
            id: driverDetails?.id ?? "",
            name: driverDetails?.name ?? "",
            email: driverDetails?.email ?? "",
            phone: driverDetails?.phone_from_driver ?? "",
            comment: driverDetails?.comment ?? ""
        })
    }, [driverDetails, setEditDriver_form])

    return (
        <div>
            <CommonModal
                showModal={showEditDriverModal}
                setShowModal={setShowEditDriverModal}
                modalTitle="Edit Driver"
                mainContent={
                    <>
                        <div className='mt-s20'>
                            <form onSubmit={submitEditDriverForm}>

                                <div className='mb-s7'>
                                    <CommonInput
                                        labelText='Name'
                                        value={editDriver_form.name}
                                        name={'name'}
                                        type='text'
                                        required={true}
                                        max_input={55}
                                        onChange={(e) => { changeEditDriverForm(e) }}
                                    />
                                </div>

                                <div className='grid grid-cols-12 gap-6 md:gap-5 2xl:gap-5 mb-s20'>
                                    <div className='col-span-6'>
                                        <CommonInput
                                            disabled={true}
                                            labelText='Email'
                                            value={editDriver_form.email}
                                            type='email'
                                        />
                                    </div>

                                    <div className='col-span-6'>
                                        <CommonInput
                                            labelText='Phone'
                                            value={editDriver_form.phone}
                                            type='number'
                                            name={'phone'}
                                            max_input={15}
                                            required={true}
                                            onChange={(e) => { changeEditDriverForm(e) }}
                                        />
                                    </div>
                                </div>

                                <div className=''>
                                    <CommonInput
                                        textarea={true}
                                        max_input={255}
                                        labelText='Instruction'
                                        value={editDriver_form?.comment}
                                        type='text'
                                        name={'comment'}
                                        onChange={(e) => { changeEditDriverForm(e) }}
                                    />
                                </div>

                                <div className='flex justify-end mt-s49'>
                                    <CommonButton
                                        width='w-[140px]'
                                        type='submit'
                                        btnLabel='Save Changes'

                                        isDisabled={editDriver_form?.name && editDriver_form?.email &&
                                            editDriver_form?.phone ?false : true
                                        }
                                    />
                                </div>
                            </form>
                        </div>
                    </>
                }

            />
        </div>
    )
}

export default EditDriverModal
