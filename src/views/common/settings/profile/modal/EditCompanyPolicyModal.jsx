/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import useSettingsStore, { updateTerms } from '../../../../../app/stores/others/settingsStore';
import CommonButton from '../../../../../components/button/CommonButton';
import CommonModal from '../../../../../components/modal/CommonModal';
import RichTextEditor from '../../../../../components/textEditor/RichTextEditor';

function EditCompanyPolicyModal() {

    const { showEditCompanyPolicyModal, setShowEditCompanyPolicyModal, termsData, setEditTermsData, editTermsData } = useSettingsStore();

    useEffect(() => {
        setEditTermsData(termsData ?? "")
    }, [termsData])


    return (
        <div>
            <CommonModal
                showModal={showEditCompanyPolicyModal}
                setShowModal={setShowEditCompanyPolicyModal}
                modalTitle="Edit Company Policy"
                mainContent={
                    <>
                        <div className='mt-s20 h-[406px]'>
                            <RichTextEditor
                                onChange={(e) => setEditTermsData(e)}
                                value={editTermsData}
                                height='300px' />

                            <div className='flex justify-end mt-s62'>
                                <CommonButton
                                    isDisabled={editTermsData !== "<p><br></p>" ? false : true}
                                    onClick={() => {

                                        const updateTermsSuccess = updateTerms();
                                        if (updateTermsSuccess) {
                                            setShowEditCompanyPolicyModal(false)
                                        }
                                    }} btnLabel='Update' />
                            </div>
                        </div>
                    </>
                }

            />
        </div>
    )
}

export default EditCompanyPolicyModal;
