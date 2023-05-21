import React, { useEffect } from 'react';
import useSettingsStore, { getProfileDetails } from '../../../../../app/stores/others/settingsStore';
import { iAddressBlack, iCvrBlack, iEmailBlack, iPhoneBlack, iWebsiteBlack } from '../../../../../app/utility/imageImports';
import { changePageTitle } from '../../../../../app/utility/utilityFunctions';
import Image from '../../../../../components/image/Image';
import RatingFiveStar from '../../../../../components/rating/RatingFiveStar';
import CommonSocialLinks from '../../../../../components/socialLinks/CommonSocialLinks';
import CommonTitle from '../../../../../components/title/CommonTitle';
import SocialLinks from './SocialLinks';

const CompanyProfile = () => {

    const { profileDetails, termsData } = useSettingsStore();

    useEffect(() => {
        fetchProfileDetails();
        changePageTitle('Settings | Profile');
    }, [])

    const fetchProfileDetails = async () => {
        await getProfileDetails();
    }

    return (

        <div>
            <div className='flex flex-col sm:flex-row sm:justify-between'>
                <CommonTitle title='Profile Details' />
            </div>

            <div className='flex flex-wrap md:flex-nowrap mt-s16'>
                <div className=''>
                    <div className='flex-col mr-s30'>
                        <Image src={profileDetails?.image} className='max-w-[160px] min-w-[160px] h-s160 rounded-full object-cover' alt="" />

                        <div className='flex justify-center'> <div className='flex flex-col mt-s8'>
                            <div className='flex justify-center text-fs16 text-cSecondaryTextColor font-fw600 mb-s4'>{profileDetails?.name}</div>
                            <div className='flex justify-center'>
                                <RatingFiveStar rating={profileDetails?.rate ? profileDetails?.rate : 0} /></div>
                        </div></div>
                    </div>

                    {/* All SocialLinks */}
                    <div className='mt-s22'><CommonSocialLinks item={profileDetails?.social_media} /></div>
                </div>

                <div className=''>
                    <div className=''>
                        <span className='text-fs24 font-fw600 text-cMainBlack'>Contact Info</span>
                        <div className='text-fs14 font-fw400 text-cDarkGray mt-s13'>
                            <div className='flex items-center my-s1'>
                                <img className='mr-s8 w-s16 h-s16' src={iCvrBlack} alt="" />
                                {profileDetails?.cvr}
                            </div>

                            <div className='flex items-center mb-s1'>
                                <img className='mr-s8 w-s16 h-s16' src={iEmailBlack} alt="" />
                                <p className='break-all'>{profileDetails?.email}</p>
                            </div>

                            <div className='flex items-center'>
                                <img className='mr-s8 w-s16 h-s16' src={iPhoneBlack} alt="" />
                                {profileDetails?.phone ?

                                    <p
                                        onClick={() => {
                                            if (profileDetails?.phone) window.location = "tel:" + profileDetails?.phone;
                                        }}
                                        className='break-all' >
                                        {profileDetails?.phone} </p> : 'NA'}
                            </div>

                            <div className='flex my-s1'>
                                <img className='mr-s8' src={iAddressBlack} alt="" />
                                {profileDetails?.address ?
                                    <a target={'_blank'} rel='noreferrer'
                                        href={`http://maps.google.com/?q=${profileDetails?.address}`}>{profileDetails?.address}</a> : 'NA'}
                            </div>

                            <div className='flex items-center'>
                                <img className='mr-s8 w-s16 h-s16' src={iWebsiteBlack} alt="" />
                                {profileDetails?.website ? <a target={'_blank'}
                                    href={profileDetails?.website?.includes("http") ? profileDetails?.website : `https://${profileDetails?.website}`} rel='noreferrer'
                                    className='break-all cursor-pointer'>{profileDetails?.website}</a> : 'NA'}
                            </div>
                        </div>
                    </div>

                    <div className='my-s24'>
                        <div className='text-fs24 text-cMainBlack font-fw600 mb-s4'>About Company</div>
                        <p className='break-all whitespace-pre-wrap text-fs14 text-cMainBlack font-fw400'>
                            {profileDetails?.about === "null" || profileDetails?.about === null ? 'NA' : profileDetails?.about}
                        </p>
                    </div>

                    <div>
                        <div className='text-fs24 text-cMainBlack font-fw600 mb-s4 '>Company Policy</div>
                        {termsData !== "<p><br></p>" ? <div className='break-all text-fs14 text-cMainBlack font-fw400'
                            dangerouslySetInnerHTML={{ __html: termsData }}
                        /> : 'NA'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;