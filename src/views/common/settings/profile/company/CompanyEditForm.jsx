import React from 'react';
import useSettingsStore from '../../../../../app/stores/others/settingsStore';
import CommonInput from '../../../../../components/input/CommonInput';

const CompanyEditForm = () => {

    const { editCompanyProfile_form, setEditCompanyProfile_form, } = useSettingsStore();

    return (
        <div>
            <div className='grid grid-cols-12 gap-6 md:gap-8 2xl:gap-10 mb-s20'>
                <div className='col-span-6'>
                    <CommonInput
                        labelText='Name'
                        value={editCompanyProfile_form?.name}
                        name={'name'} type='text' max_input={55}
                        onChange={(e) => { setEditCompanyProfile_form({ ...editCompanyProfile_form, name: e.target.value }) }}
                    />
                </div>
                <div className='col-span-6'>
                    <CommonInput
                        labelText='CVR' disabled={true} name={'cvr'} type='number'
                        value={editCompanyProfile_form?.cvr}
                        onChange={(e) => { setEditCompanyProfile_form({ ...editCompanyProfile_form, cvr: e.target.value }) }}
                    />
                </div>
            </div>

            <div className='grid grid-cols-12 gap-6 md:gap-8 2xl:gap-10 mb-s20'>

                <div className='col-span-6'>
                    <CommonInput
                        disabled={true} labelText='Email' type='email' name={'email'}
                        value={editCompanyProfile_form?.email}
                        onChange={(e) => { setEditCompanyProfile_form({ ...editCompanyProfile_form, email: e.target.value }) }}
                    />
                </div>

                <div className='col-span-6'>
                    <CommonInput
                        labelText='Phone'
                        type='number' name='phone' max_input={15}
                        value={editCompanyProfile_form?.phone}
                        onChange={(e) => {
                            setEditCompanyProfile_form({ ...editCompanyProfile_form, phone: e.target.value })
                        }}
                    />
                </div>
            </div>

            <div className='mb-s20'>
                <CommonInput
                    labelText='Website' name={'website'} type='text'
                    value={editCompanyProfile_form?.website}
                    onChange={(e) => { setEditCompanyProfile_form({ ...editCompanyProfile_form, website: e.target.value }) }}
                />
            </div>
        </div>
    );
};

export default CompanyEditForm;