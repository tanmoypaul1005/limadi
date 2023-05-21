import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useSettingsStore, { getToggleNotificationState, handleNotificationToggle } from "../../../app/stores/others/settingsStore";
import { changePageTitle } from "../../../app/utility/utilityFunctions";
import CommonButton from "../../../components/button/CommonButton";
import CommonSettingsItems from "../../../components/settings/Components/CommonSettingsItems";
import CommonTitle from "../../../components/title/CommonTitle";

const Settings = (props) => {

    const navigate = useNavigate();

    const location = useLocation();

    const { pushNotification, emailNotification } = useSettingsStore();


    const EmailItem = [
        { value: 'Off', checked: !emailNotification ? true : false, onChange: () => { handleNotificationToggle({ "is_email": false }, "is_email") } },
        { value: 'On', checked: emailNotification ? true : false, onChange: () => { handleNotificationToggle({ "is_email": true }, "is_email") } },//Radio Button Value
    ]

    const NotificationItem = [
        { value: 'Off', checked: !pushNotification ? true : false, onChange: () => { handleNotificationToggle({ "is_push": false }, "is_push") } },
        { value: 'On', checked: pushNotification ? true : false, onChange: () => { handleNotificationToggle({ "is_push": true }, "is_push") } },//Radio Button Value
    ]


    useEffect(() => {
        fetchEmailAndNotification()
        changePageTitle('Settings | Profile');
    }, [])

    const fetchEmailAndNotification = async () => {
        await getToggleNotificationState()
    }

    let user = JSON.parse(localStorage.getItem('user'));

    const role = user.role === 'private' ? 'Customer' : 'Company';

    // console.log("pushNotification,emailNotification", pushNotification, emailNotification)

    return (
        <div className="">
            <div className="flex justify-between">
                <CommonTitle title="Settings" />
                <div>
                    {location.pathname === "/settings" && role === 'Company' ?
                        <CommonButton
                            onClick={() => { navigate("/settings/company-profile/edit") }}
                            btnLabel='Edit' width='w-[100px]' /> : ''}
                    {/* { location.pathname === "/settings/company-profile/edit" && role === 'Customer' ? } */}
                </div>
            </div>
            <div className="mb-s20"></div>
            <div className="grid grid-cols-12 gap-6 md:gap-8 2xl:gap-8">
                <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-5">
                    <div className="flex-col">
                        <div className="mb-s8">
                            <CommonSettingsItems
                                onClick={() => {
                                    navigate('/settings')
                                }}
                                title=" Profile"
                                className={"mb-[5px] mt-[5px]"}
                                selected={location.pathname === '/settings' || location.pathname === "/settings/company-profile/edit"}
                            />
                        </div>

                        <div className="mb-s15">
                            <CommonSettingsItems
                                onClick={() => {
                                }}
                                hasSwitch={true}
                                item={EmailItem}
                                title="E-mail Notification"
                                className={"mb-[5px] mt-[5px]"}
                                selected={false}
                            />
                        </div>

                        <div className="mb-s15">
                            <CommonSettingsItems
                                onClick={() => {
                                }}
                                hasSwitch={true}
                                item={NotificationItem}
                                title="Push Notification"
                                className={"mb-[5px] mt-[5px]"}
                                selected={false}
                            />
                        </div>

                        <div className="mb-s15">
                            <CommonSettingsItems
                                onClick={() => {
                                    navigate('/settings/change-password')
                                }}
                                title="Change Password"

                                className={"mb-[5px] mt-[5px]"}
                                selected={location.pathname === '/settings/change-password' && true}
                            /></div>

                        <div className="mb-s15">
                            <CommonSettingsItems
                                onClick={() => {
                                    navigate('/settings/language')
                                }}
                                title="Language"
                                className={"mb-[5px] mt-[5px]"}
                                selected={location.pathname === '/settings/language' && true}
                            /></div>

                        <div className="mb-s15">
                            <CommonSettingsItems
                                onClick={() => {
                                    navigate('/settings/terms-conditions')
                                }}
                                title="Terms & Conditions"
                                className={"mb-[5px] mt-[5px]"}
                                selected={location.pathname === '/settings/terms-conditions' && true}
                            /></div>

                        <div className="mb-s15">
                            <CommonSettingsItems
                                onClick={() => {
                                    navigate('/settings/contact')
                                }}
                                title="Contact Limadi"
                                className={"mb-[5px] mt-[5px]"}
                                selected={location.pathname === '/settings/contact' && true}
                            />
                        </div>

                        <div className="mb-s15">
                            <CommonSettingsItems
                                onClick={() => {
                                    navigate('/settings/faq')
                                }}
                                title="FAQ"
                                className={"mb-[5px] mt-[5px]"}
                                selected={location.pathname === '/settings/faq' && true}
                            />
                        </div>

                    </div>
                </div>
                <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-7">
                    <div className="">
                        {props?.children}
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
