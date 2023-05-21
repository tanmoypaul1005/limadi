import React, { useEffect } from 'react';
import useSettingsStore, { getProfileDetails } from '../../../../../app/stores/others/settingsStore';
import { iAddressBlack, iEmailBlack, iPhoneBlack } from '../../../../../app/utility/imageImports';
import { changePageTitle } from '../../../../../app/utility/utilityFunctions';
import CommonButton from '../../../../../components/button/CommonButton';
import Image from '../../../../../components/image/Image';
import SettingsTitle from '../../SettingsTitle';

const CustomerProfile = () => {

    const { setShowProfileEditModal, profileDetails } = useSettingsStore();

    useEffect(() => {
        fetchProfileDetails();
        changePageTitle('Settings | Profile');
    }, [])

    const fetchProfileDetails = async () => {
        await getProfileDetails()
    }

    return (
        <>
            <SettingsTitle title="Profile Details" />
            <div className='flex flex-col lg:flex-row sm:justify-between text-fs14 font-fw400 text-cDarkGray'>
                <div className='mr-s30 flex justify-center items-center'><div>
                    <Image
                        src={profileDetails?.image}
                        className='max-w-[60px] min-w-[160px] h-s160 rounded-full object-cover' alt="" />

                    <div className='flex justify-center items-center mt-s8'>
                        <div className='text-cMainBlack'>{profileDetails?.name}</div>
                    </div>
                </div>
                </div>

                <div className='w-full mt-s20 lg:mt-0'>
                    <span className='text-fs24 font-fw600 text-cMainBlack mb-s16'>
                        Contact Info
                    </span>

                    <div className='my-s2 text-cDarkGray flex items-center'>
                        <img src={iEmailBlack} className="mr-s8 w-s16 h-s16" alt="" />
                        <p className=''>{profileDetails?.email}</p>
                    </div>
                    <div className='text-cDarkGray flex items-center'>
                        <img src={iPhoneBlack} className="mr-s8 w-s16 h-s16" alt="" />
                        {profileDetails?.phone ? profileDetails?.phone : 'NA'}
                    </div>
                    <div className='my-s2 text-cDarkGray flex items-center'>
                        <img src={iAddressBlack} className="mr-s8 " alt="" />
                        {profileDetails?.address ?
                            <a target={'_blank'} rel='noreferrer'
                                href={`http://maps.google.com/?q=${profileDetails?.address}`}>{profileDetails?.address}</a> : 'NA'}
                    </div>

                    <div className='flex flex-col sm:flex-row sm:justify-end mt-s20'>
                        <div className=""><CommonButton onClick={() => { setShowProfileEditModal(true) }} btnLabel='Edit' width='w-[100px]' /></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomerProfile;