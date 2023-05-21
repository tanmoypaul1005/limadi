import React from 'react';
import useSettingsStore from '../../../../../app/stores/others/settingsStore';
import { iFacebook, iLinkedIn, iTwitter } from '../../../../../app/utility/imageImports';

const SocialLinks = () => {

    const { profileDetails } = useSettingsStore();

    return (
        <div>
            {profileDetails?.social_media?.length && <div className='mt-s22 md:mb-0 mb-s25'>
                <span className='text-fs24 font-fw600 text-cMainBlack'>
                    {profileDetails?.social_media?.find(item => item?.link !== "") ?
                        'Social Links' : 'No Social Links'}
                </span>
                <div className='flex flex-wrap mt-s13'>
                    {profileDetails?.social_media?.map((item, index) => (
                        <div key={index}>

                            {
                                item?.domain.includes("facebook") && item?.link !== "" &&
                                <a target="blank" href={item?.link?.includes("http") ? item?.link : "http://" + item?.link}>
                                    <img className='max-w-[30px] min-w-[40px] cursor-pointer mr-s16'
                                        src={iFacebook} alt="Facebook icon" />
                                </a>
                            }

                            {
                                item?.domain.includes("twitter") && item?.link !== "" &&
                                <a target="blank" href={item?.link?.includes("http") ? item?.link : "http://" + item?.link}>
                                    <img className='max-w-[30px] min-w-[40px] cursor-pointer mr-s16'
                                        src={iTwitter} alt="iTwitter" />
                                </a>
                            }

                            {
                                item?.domain.includes("linkedin") && item?.link !== "" &&
                                <a target="blank" href={item?.link?.includes("http") ? item?.link : "http://" + item?.link}>
                                    <img className='max-w-[30px] min-w-[40px] cursor-pointer' src={iLinkedIn} alt="LinkedIn" />
                                </a>
                            }
                        </div>
                    ))}
                </div>
            </div>}
        </div>
    );
};

export default SocialLinks;