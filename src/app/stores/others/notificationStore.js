import axios from "axios";
import { create } from "zustand";
import { kuGetNotification, kuNotificationSeen } from "../../urls/commonUrl";
import { formatDate, Toastr } from "../../utility/utilityFunctions";
import useGeneralStore from "./generalStore";
import useUtilityStore from "./utilityStore";

const { setLoading, setHasUnseenNotification } = useGeneralStore.getState();

const { setLoadingSearch } = useUtilityStore.getState();

const useNotificationStore = create((set) => ({

    notificationList: [],
    setNotificationList: (value) => set({ notificationList: value }),

    notificationTempList: [],
    setNotificationTempList: (value) => set({ notificationTempList: value }),

    selectedIndex: null,
    setSelectedIndex: (value) => set({ selectedIndex: value }),

    selectedNotification: {},
    setSelectedNotification: (value) => set({ selectedNotification: value }),

    notificationDetails: {},
    setNotificationDetails: (value) => set({ notificationDetails: value }),

    searchKey: "",
    setSearchKey: (value) => set({ searchKey: value }),

    //All Modal

    notificationDropDownOpen: false,
    setNotificationDropDownOpen: (value) => set({ notificationDropDownOpen: value }),

    showNotificationDetailsModal: false,
    setShowNotificationDetailsModal: (value) => set({ showNotificationDetailsModal: value }),

}));

export default useNotificationStore;

//Get Notification
export const getNotification = async () => {
    const { setNotificationList, setNotificationTempList, setSelectedNotification, setSelectedIndex } = useNotificationStore.getState();
    try {
        setLoading(true)
        const res = await axios.get(kuGetNotification);
        console.log('getNotification::::::', res.data);

        if (res?.data?.success) {
            setNotificationList(res?.data?.data);
            setNotificationTempList(res.data.data);
            if (res.data.data.length > 0) {
                setSelectedIndex(0)
                setSelectedNotification(res.data.data[0]);
                checkUnseenNotification(res.data.data);
            }
        } else {
            Toastr({ "message": res?.data?.message, type: 'error' });
        }
        setLoading(false)
    } catch (error) {
        console.log('getNotification Error::::::', error);
        Toastr({ "message": "An error occurred!", type: 'error' });
        setLoading(false)
        return false;
    }
};

// Notification seen
export const notificationSeenFn = async (id, index) => {

    const { notificationList } = useNotificationStore.getState();

    try {
        // setLoading(true)
        const body = { id: id };
        const res = await axios.post(kuNotificationSeen, body);

        console.log('notificationSeenFn::::::', res.data);

        if (res?.data?.success) {
            let x = localStorage.getItem('numOfUnreadNotification').toString();
            let y = parseInt(x);
            localStorage.setItem("numOfUnreadNotification", --y);
            setHasUnseenNotification();
        } else {
            notificationList[index].is_seen = 0;
            Toastr({ "message": res?.data?.message, type: 'error' });
        }
    } catch (error) {
        console.log('notificationSeenFn Error::::::', error);
        Toastr({ "message": "An error occurred!", type: 'error' });
        // setLoading(false);
        return false;
    }
};

export const selectNotification = (index, is_seen) => {
    const { setSelectedIndex, setSelectedNotification, notificationList,setNotificationList } = useNotificationStore.getState();
    setSelectedIndex(0);
    setSelectedNotification(notificationList[index]);
    setNotificationList([notificationList[index],...notificationList?.filter(i => i?.id !== notificationList[index]?.id)])
    notificationList[index].is_seen = 1;
    (is_seen === 0) && notificationSeenFn(notificationList[index].id, index);
};

export const checkUnseenNotification = (notifications) => {
    let count = 0;
    for (let index = 0; index < notifications.length; index++) {
        if (notifications[index].is_seen === 0) count++;
    }
    localStorage.setItem("numOfUnreadNotification", count);
    setHasUnseenNotification();
}



//Search Notification
export const searchNotifications = (searchValue) => {

    const { setNotificationList, notificationTempList, setSelectedIndex, setSelectedNotification } = useNotificationStore.getState();

    setLoadingSearch(true)
    setSelectedIndex("");
    setSelectedNotification("")
    // eslint-disable-next-line array-callback-return
    const result = notificationTempList.filter((item) => {
        if (item.title) {
            let title = "";
            title = item?.title ?? "";
            if (
                title.toLowerCase().includes(searchValue.toLowerCase()) ||
                item?.description.toLowerCase().includes(searchValue.toLowerCase()) ||
                formatDate(item?.created_date)?.toLowerCase().includes(searchValue.toLowerCase())
            ) {
                return item;
            }
        }
    });
    setLoadingSearch(false)
    setNotificationList(result);
};
