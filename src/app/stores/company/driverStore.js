import axios from "axios";
import { create } from "zustand";
import { kuDriverList, kuEditDriver, kuAddDriver, kuDeleteDriver } from "../../urls/companyUrl";
import { Toastr } from "../../utility/utilityFunctions";
import useGeneralStore from "../others/generalStore";
import useUtilityStore from "../others/utilityStore";
const { setLoading } = useGeneralStore.getState();
const { setLoadingSearch } = useUtilityStore.getState();

const useDriverStore = create((set, get) => ({

  driverList: [],
  setDriverList: (value) => set({ driverList: value }),

  tempDriverList: [],
  setTempDriverList: (value) => set({ tempDriverList: value }),

  driverDetails: {},
  setDriverDetails: (value) => set({ driverDetails: value }),

  selectedDriverIndex: 0,
  setSelectedDriverIndex: (value) => set({ selectedDriverIndex: value }),

  selectedDriverDeleteId: null,
  setSelectedDriverDeleteId: (value) => set({ selectedDriverDeleteId: value }),

  driverSearchValue: "",
  setDriverSearchValue: (value) => set({ driverSearchValue: value }),

  addDriver_form: { email: "", name: "", phone: "", comment: "" },
  changeAddDriverForm: (e) => set({ addDriver_form: { ...get().addDriver_form, [e.target.name]: e.target.value } }),
  setAddDriver_form: (value) => set({ addDriver_form: value }),

  editDriver_form: { id: "", email: "", name: "", phone: "", comment: "" },
  changeEditDriverForm: (e) => set({ editDriver_form: { ...get().editDriver_form, [e.target.name]: e.target.value } }),
  setEditDriver_form: (value) => set({ editDriver_form: value }),

  //All Modal
  showAddDriverModal: false,
  setShowAddDriverModal: (value) => set({ showAddDriverModal: value }),

  showEditDriverModal: false,
  setShowEditDriverModal: (value) => set({ showEditDriverModal: value }),

  showDriverDeleteModal: false,
  setShowDriverDeleteModal: (value) => set({ showDriverDeleteModal: value }),

}));

export default useDriverStore;

// get Driver
export const getDrivers = async (isRefresh = true) => {

  const { setDriverList, setDriverDetails, setSelectedDriverIndex, setTempDriverList
  } = useDriverStore.getState();

  try {
    setLoading(true)
    const res = await axios.get(kuDriverList);
    console.log('getDrivers:::', res.data);
    if (res?.data?.success) {
      setDriverList(res?.data?.data)
      setTempDriverList(res?.data?.data)
      if (isRefresh) {
        setDriverDetails(res?.data?.data[0])
        setSelectedDriverIndex(0)
      }
    } else {
      Toastr({ "message": res?.data?.message, type: 'error' });
    }
    setLoading(false)
  } catch (error) {
    console.log('getDrivers:::', error);
    Toastr({ "message": "An error occurred!", type: 'error' });
    setLoading(false);
  }
};

// add Driver
export const addDriver = async () => {
  const { addDriver_form, driverList, setDriverList, setSelectedDriverIndex, setDriverDetails, setTempDriverList } = useDriverStore.getState();
  try {
    setLoading(true)
    const res = await axios.post(kuAddDriver, addDriver_form);
    console.log('addDriver:::', res.data);
    if (res?.data?.success) {
      setDriverList([res?.data?.data, ...driverList]);
      setTempDriverList([res?.data?.data, ...driverList])
      setSelectedDriverIndex(0);
      setDriverDetails(res?.data?.data);
      setLoading(false);
      return true;
    } else {
      Toastr({ "message": res?.data?.message, type: 'error' });
      setLoading(false);
      return false
    }
  } catch (error) {
    console.log('addDriver:::', error);
    Toastr({ "message": "An error occurred!", type: 'error' });
    setLoading(false);
    return false;
  }
};

// edit Driver
export const editDriver = async () => {

  const { editDriver_form, setDriverDetails, driverDetails, setDriverList, driverList, setTempDriverList } = useDriverStore.getState();

  try {
    setLoading(true)
    const res = await axios.post(kuEditDriver, editDriver_form);
    console.log('editDriver:::', res.data);
    if (res?.data?.success) {
      const editData = { id: editDriver_form?.id, name: editDriver_form?.name, email: editDriver_form?.email, phone_from_driver: editDriver_form?.phone, image: driverDetails?.image, comment: editDriver_form?.comment }
      setDriverDetails(editData);
      setDriverList([editData, ...driverList.filter(item => item.id !== editDriver_form?.id)]);
      setTempDriverList([editData, ...driverList.filter(item => item.id !== editDriver_form?.id)]);
      setLoading(false);
      return true;
    } else {
      Toastr({ "message": res?.data?.message, type: 'error' });
      setLoading(false);
      return false;
    }

  } catch (error) {
    console.log('editDriver:::', error);
    Toastr({ "message": "An error occurred!", type: 'error' });
    setLoading(false);
    return false;
  }
};

// Delete Driver
export const deleteDriver = async () => {

  const { selectedDriverDeleteId, driverList, setDriverList, setTempDriverList, setDriverDetails, setSelectedDriverIndex } = useDriverStore.getState();

  try {
    setLoading(true)
    const res = await axios.post(kuDeleteDriver, { id: selectedDriverDeleteId, deleted_by: "company" });
    console.log('deleteDriver:::', res.data);
    if (res?.data?.success) {
      Toastr({ "message": res?.data?.message, type: 'success' });
      const data = driverList.filter(item => item?.id !== selectedDriverDeleteId)
      setDriverList(data)
      setTempDriverList(data)
      setDriverDetails(driverList[0])
      setSelectedDriverIndex(0)
      setLoading(false);
      return true
    } else {
      Toastr({ "message": res?.data?.message, type: 'error' });
      setLoading(false);
      return false
    }

  } catch (error) {
    console.log('deleteDriver:::', error);
    Toastr({ "message": "An error occurred!", type: 'error' });
    setLoading(false);
    return false;
  }
};

//Search Driver
export const searchDriver = (searchValue) => {

  const { setDriverList, tempDriverList, setDriverDetails, setSelectedDriverIndex } = useDriverStore.getState();

  setLoadingSearch(true)
  setDriverDetails({})
  setSelectedDriverIndex("")
  // eslint-disable-next-line array-callback-return
  const result = tempDriverList?.filter((item) => {
    const name = item?.name ?? "";
    if (
      name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item?.email.toLowerCase().includes(searchValue.toLowerCase()) || item?.phone_from_driver?.includes(searchValue)
    ) {
      return item;
    }
  });
  setLoadingSearch(false)
  setDriverList(result);
};

export const selectDriver = async (item, index) => {
  const { driverList, setDriverList, setDriverDetails, setSelectedDriverIndex } = useDriverStore.getState();
  await setDriverDetails(item);
  await setDriverList([item, ...driverList?.filter(i => i?.id !== item?.id)])
  setSelectedDriverIndex(0);
}
