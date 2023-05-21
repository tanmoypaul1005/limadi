/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSettingsStore, { editProfile, getProfileDetails } from '../../../../../app/stores/others/settingsStore';
import { iEditGray } from '../../../../../app/utility/imageImports';
import { isValidUrl, Toastr } from '../../../../../app/utility/utilityFunctions';
import CommonButton from '../../../../../components/button/CommonButton';
import CommonButtonOutlined from '../../../../../components/button/CommonButtonOutlined';
import ProfileImageUploader from '../../../../../components/imageUpload/ProfileImageUploader';
import AddressAutoComplete from '../../../../../components/input/AddressAutoComplete';
import CommonInput from '../../../../../components/input/CommonInput';
import CommonTitle from '../../../../../components/title/CommonTitle';
import CompanyEditForm from './CompanyEditForm';

const EditCompanyProfile = () => {

    const navigateTo = useNavigate();

    const {
        editCompanyProfile_form,
        profileDetails,
        setEditCompanyProfile_form,
        setCompanyProfileImage,
        companyProfileImage,
        termsData,
        setShowEditCompanyPolicyModal,
        setShowAboutCompanyModal
    } = useSettingsStore();

    const [updateFB, setUpdateFB] = useState("");
    const [updateTwitter, setUpdateTwitter] = useState("");
    const [updateLinkedin, setUpdateLinkedin] = useState("");

    const [doSearch, setDoSearch] = useState(false);
    const [addAddressLabel, setAddAddressLabel] = useState("");
    const [lat, setLat] = useState("");

    useEffect(() => {
        fetchProfileDetails()
    }, [])

    const fetchProfileDetails = async () => {
        await getProfileDetails();
    }

    useEffect(() => {
        setEditCompanyProfile_form({
            ...editCompanyProfile_form,
            id: profileDetails?.id ?? "",
            name: profileDetails?.name ?? "",
            cvr: profileDetails?.cvr ?? "",
            email: profileDetails?.email ?? "",
            phone: profileDetails?.phone ?? "",
            address: profileDetails?.address ?? "",
            website: profileDetails?.website ?? "",
            lng: profileDetails?.lng,
            about: profileDetails?.about ?? ""
        });
        setAddAddressLabel(profileDetails?.address);
        setLat(profileDetails?.lat);
        profileDetails?.social_media?.length > 0 &&
            profileDetails?.social_media?.map((item, index) => (
                <div key={index}>
                    {item?.domain.includes("facebook") && setUpdateFB(item?.link)}
                    {item?.domain.includes("twitter") && setUpdateTwitter(item?.link)}
                    {item?.domain.includes("linkedin") && setUpdateLinkedin(item?.link)}
                </div>
            ))
    }, [profileDetails])

    const handleChange = async (name, value) => {
        if (name === "address") {
            setAddAddressLabel(value);
        } else if (name === "lat") {
            setLat(value);
        } else if (name === "lng") {
            setEditCompanyProfile_form({ ...editCompanyProfile_form, lng: value });
        }
    };

    const submitEditCompanyProfileForm = async () => {
        let body = {};
        let social_media = {};

        if (updateFB && !isValidUrl(updateFB)) {
            return Toastr({ message: "Please Enter valid facebook url", type: "warning" })
        } else if (updateTwitter && !isValidUrl(updateTwitter)) {
            return Toastr({ message: "Please Enter valid twitter url", type: "warning" })
        } else if (updateLinkedin && !isValidUrl(updateLinkedin)) {
            return Toastr({ message: "Please Enter valid linkedin url", type: "warning" })
        }
        else {
            social_media = JSON.stringify([
                {
                    domain: "facebook",
                    link: updateFB ?? ''
                },
                {
                    domain: "twitter",
                    link: updateTwitter ?? ''
                },
                {
                    domain: "linkedin",
                    link: updateLinkedin ?? ''
                }
            ]);
        }
        if (addAddressLabel === null || addAddressLabel === "") {
            body = {
                name: editCompanyProfile_form?.name ?? "",
                cvr: editCompanyProfile_form?.cvr ?? "",
                phone: editCompanyProfile_form?.phone ?? "",
                about: editCompanyProfile_form?.about ?? "",
                image: companyProfileImage ?? "",
                website: editCompanyProfile_form?.website ?? "",
                socials: social_media,
            };
        } else {
            if (lat && editCompanyProfile_form?.lng) {
                body = {
                    name: editCompanyProfile_form?.name,
                    cvr: editCompanyProfile_form?.cvr,
                    phone: editCompanyProfile_form?.phone ?? "",
                    about: editCompanyProfile_form?.about ?? "",
                    address: addAddressLabel ?? "",
                    lat: lat ?? "",
                    lng: editCompanyProfile_form?.lng,
                    image: companyProfileImage ?? "",
                    website: editCompanyProfile_form?.website ?? "",
                    socials: social_media,
                };
            } else {
                return Toastr({ message: "Invalid Address!", type: "warning" })
            }
        }

        if (body.website) {
            if (isValidUrl(body?.website)) {
                const success = await editProfile(body);
                if (success) { navigateTo("/settings") }
            } else {
                return Toastr({ message: "Please Enter valid url", type: "warning" })
            }
        } else {
            const success = await editProfile(body);
            if (success) { navigateTo("/settings") }
        }
    }

    return (
        <div>
            <div className='flex flex-col md:flex-row md:justify-between items-center'>
                <CommonTitle icon={true} link="/settings" title="Edit Profile" />
                <div className='flex items-center space-x-4 mt-s16 md:mt-0'>
                    <CommonButtonOutlined onClick={() => {
                        navigateTo("/settings/delete-account");
                    }} btnLabel="Delete" colorType='danger' width='w-[100px]' />
                    <div className=''> <CommonButton btnLabel='Update'
                        onClick={submitEditCompanyProfileForm} width='w-[100px]' /></div>
                </div>
            </div>
            <div className='flex justify-center items-center mt-s16'>
                <ProfileImageUploader
                    height='h-[160px]'
                    width='w-[160px]'
                    iImage={profileDetails?.image}
                    setImage={setCompanyProfileImage}
                />
            </div>
            <div className='mt-s16 text-fs24 text-cMainBlack font-fw600'>Basic Info</div>

            <form>

                <CompanyEditForm />

                <div className='mb-s20'>
                    <AddressAutoComplete
                        // required={true} 
                        label={("Address")}
                        placeholder={("Type Address..")} name={"address"}
                        address={addAddressLabel} latName={"lat"} lngName={"lng"}
                        changeValue={handleChange} doSearch={doSearch}
                        setDoSearch={setDoSearch}
                        icon={false}
                    />
                </div>

                <div className='text-fs24 text-cMainBlack font-fw600 mt-s29 mb-s3'>Social Links</div>

                <div className='mb-s20'>
                    <CommonInput labelText='Facebook' value={updateFB} onChange={(e) => { setUpdateFB(e.target.value) }} />
                </div>

                <div className='mb-s20'>
                    <CommonInput labelText='Twitter' value={updateTwitter} onChange={(e) => { setUpdateTwitter(e.target.value) }} />
                </div>


                <CommonInput labelText='LinkedIn' onChange={(e) => { setUpdateLinkedin(e.target.value) }} value={updateLinkedin} />
                <div className='my-s24'>
                    <div className='flex'><div className='text-fs24 text-cMainBlack font-fw600 mb-s5 mr-s4'>About Company</div><img onClick={() => {
                        setShowAboutCompanyModal(true)
                    }}
                        className='cursor-pointer'
                        src={iEditGray} alt="" /></div>
                    <div className='text-fs14 text-cMainBlack font-fw400 '>
                        {editCompanyProfile_form?.about ? <p className='text-fs14 text-cMainBlack font-fw400 max-w-full truncate whitespace-pre-wrap break-all'>
                            {editCompanyProfile_form?.about === "null" || editCompanyProfile_form?.about === null ? 'NA' : editCompanyProfile_form?.about}
                        </p> : 'NA'}
                    </div>
                </div>

                <div className=''>
                    <div className='flex'>
                        <div className='text-fs24 text-cMainBlack font-fw600 mb-s5 mr-s4'>Company Policy</div>
                        <img onClick={() => { setShowEditCompanyPolicyModal(true) }} className='cursor-pointer' src={iEditGray} alt="" />
                    </div>
                    {termsData ? <div className='text-fs14 text-cMainBlack font-fw400 max-w-full truncate whitespace-pre-wrap break-all' dangerouslySetInnerHTML={{ __html: termsData }} /> : 'NA'}
                </div>

            </form>
        </div>
    );
};

export default EditCompanyProfile;