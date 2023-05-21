import { iNotificationIcon, iNotificationShow, iWhiteLimadi, iLogo1, } from "../../app/utility/imageImports";
import AccountSettingsDropDown from "../dropdown/AccountSettingsDropDown";
import FreeDropDown from "../dropdown/FreeDropDown";
import { Link, useLocation } from "react-router-dom";
import NotificationDropdown from "./notificationDropdown/NotificationDropdown";
import Image from "../image/Image";
import useGeneralStore from "../../app/stores/others/generalStore";
import useNotificationStore from "../../app/stores/others/notificationStore";
import useSettingsStore from "../../app/stores/others/settingsStore";

const Topbar = ({ isOpenSidebar, setIsSidebarOpen }) => {

  let user = JSON.parse(localStorage.getItem('user'));

  const { numOfUnreadNotification } = useGeneralStore();

  const location = useLocation()

  const { setNotificationDropDownOpen, notificationDropDownOpen } = useNotificationStore();

  const { profileDropDownOpen, setProfileDropDownOpen } = useSettingsStore();

  return (
    <div className={`absolute top-0 z-[1001] items-center w-full bg-cBrand h-s56 flex flex-row justify-between`} >

      <Link className="h-s35 flex items-center ml-5" to={'/'}>
        <img src={iLogo1} alt="" className="w-auto h-full" />
      </Link>

      <div className="flex flex-row justify-end items-center space-x-2 mr-5">

        <div className="">
          <FreeDropDown
            width="w-[450px]"
            shadowCustom="shadow-lg"
            button={
              <>

                {location.pathname !== '/notification' && <div>
                  {
                    !numOfUnreadNotification > 0 ?
                      <img
                        onClick={() => { setNotificationDropDownOpen(true) }}
                        src={iNotificationIcon}
                        alt=""
                        className="rounded-full cursor-pointer h-[36px] w-[46px] relative"
                        srcSet=""
                      /> : <img
                        onClick={() => { setNotificationDropDownOpen(true) }}
                        src={iNotificationShow}
                        alt=""
                        className="rounded-full cursor-pointer h-[36px] w-[46px] relative"
                        srcSet=""
                      />
                  }
                </div>}
              </>
            }
            body={
              <>
                {notificationDropDownOpen && <NotificationDropdown />}
              </>
            }
          /></div>

        <FreeDropDown
          shadowCustom="shadow-lg"
          button={
            <>
              <div onClick={() => { setProfileDropDownOpen(true) }}><Image
                withPreview={true}
                src={user?.image}
                alt=""
                className="rounded-full cursor-pointer h-[32px] w-[32px] object-cover hover:bg-red-500"
                srcSet=""
              />
              </div>
            </>
          }
          body={
            <>
              {profileDropDownOpen && <AccountSettingsDropDown />}
            </>
          }
        />
      </div>

    </div>

  );
};

export default Topbar;


export const ggg = () => { }

