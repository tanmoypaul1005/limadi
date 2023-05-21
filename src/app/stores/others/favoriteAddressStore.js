import axios from "axios";
import { create } from "zustand";
import { kuAddFavoriteAddress, kuDeleteFavoriteAddress, kuGetFavoriteAddress, kuUpdateFavoriteAddress } from "../../urls/commonUrl";
import { Toastr } from "../../utility/utilityFunctions";
import useGeneralStore from "./generalStore";
import useUtilityStore from "./utilityStore";
const { setLoading } = useGeneralStore.getState();

const { setLoadingSearch } = useUtilityStore.getState();

const useFavoriteAddressStore = create((set, get) => ({

  favoriteAddressList: [],
  setFavoriteAddressList: (value) => set({ favoriteAddressList: value }),

  tempFavoriteAddress: [],
  setTempFavoriteAddress: (value) => set({ tempFavoriteAddress: value }),

  favoriteAddressDetails: {},
  setFavoriteAddressDetails: (value) => set({ favoriteAddressDetails: value }),

  selectedFavoriteAddressIndex: 0,
  setSelectedFavoriteAddressIndex: (value) => set({ selectedFavoriteAddressIndex: value }),

  selectedFavoriteAddressDeleteId: null,
  setSelectedFavoriteAddressDeleteId: (value) => set({ selectedFavoriteAddressDeleteId: value }),

  addAddressLabel: "",
  setAddAddressLabel: (value) => set({ addAddressLabel: value }),

  favoriteAddressSearchValue: "",
  setFavoriteAddressSearchValue: (value) => set({ favoriteAddressSearchValue: value }),

  editFavoriteAddress_form: { fav_id: "", title: "", address: "", note: "", lat: "", lng: "" },
  setEditFavoriteAddress_form: (value) => set({ editFavoriteAddress_form: value }),

  addFavoriteAddress_form: { title: "", address: "", note: "", lat: "", lng: "" },
  setAddFavoriteAddress_form: (value) => set({ addFavoriteAddress_form: value }),

  //All Modal
  showAddFavoriteAddressModal: false,
  setShowAddFavoriteAddressModal: (value) => set({ showAddFavoriteAddressModal: value }),

  showEditFavoriteAddressModal: false,
  setShowEditFavoriteAddressModal: (value) => set({ showEditFavoriteAddressModal: value }),

  showFavoriteAddressDeleteModal: false,
  setShowFavoriteAddressDeleteModal: (value) => set({ showFavoriteAddressDeleteModal: value }),

}));
export default useFavoriteAddressStore;

// get Favorite Address
export const getFavoriteAddress = async (isRefresh = true) => {

  const { setFavoriteAddressList, setFavoriteAddressDetails, setTempFavoriteAddress, setSelectedFavoriteAddressIndex } = useFavoriteAddressStore.getState();

  try {
    setLoading(true)
    const res = await axios.get(kuGetFavoriteAddress);
    console.log('getFavoriteAddress:::', res.data);
    if (res?.data?.success) {
      setFavoriteAddressList(res?.data?.data)
      setTempFavoriteAddress(res?.data?.data)
      if (isRefresh) {
        setFavoriteAddressDetails(res?.data?.data[0])
        setSelectedFavoriteAddressIndex(0)
      }
    } else {
      Toastr({ "message": res?.data?.message, type: 'error' });
    }
    setLoading(false)
  } catch (error) {
    console.log('getFavoriteAddress:::', error);
    Toastr({ "message": "An error occurred!", type: 'error' });
    setLoading(false);
    return false;
  }
};

// Add Favorite Address
export const addFavoriteAddress = async () => {

  const { addFavoriteAddress_form, setFavoriteAddressList, favoriteAddressList, setTempFavoriteAddress, setSelectedFavoriteAddressIndex, setFavoriteAddressDetails } = useFavoriteAddressStore.getState();

  try {
    setLoading(true)
    const res = await axios.post(kuAddFavoriteAddress, addFavoriteAddress_form,);
    console.log('addFavoriteAddress:::', res.data);
    if (res?.data?.success) {
      Toastr({ "message": res?.data?.message, type: 'success' });

      const newList = [...favoriteAddressList];
      newList.unshift(res?.data?.data);
      setFavoriteAddressList(newList)
      setTempFavoriteAddress(newList)

      setSelectedFavoriteAddressIndex(0);
      setFavoriteAddressDetails(res?.data?.data)
      setLoading(false)
      return true;
    } else {
      Toastr({ "message": res?.data?.message, type: 'error' });
      setLoading(false)
      return false;
    }
  } catch (error) {
    console.log('addFavoriteAddress:::', error);
    Toastr({ "message": "An error occurred!", type: 'error' });
    setLoading(false);
    return false;
  }
};

// Edit Favorite Address
export const editFavoriteAddress = async () => {

  const { editFavoriteAddress_form, setFavoriteAddressDetails, favoriteAddressList, setFavoriteAddressList, setTempFavoriteAddress } = useFavoriteAddressStore.getState();

  try {
    setLoading(true)
    const res = await axios.post(kuUpdateFavoriteAddress, editFavoriteAddress_form);
    console.log('editFavoriteAddress:::', res?.data);
    if (res?.data?.success) {
      setFavoriteAddressDetails(res?.data?.data)
      setFavoriteAddressList([res?.data?.data, ...favoriteAddressList.filter(item => item.id !== editFavoriteAddress_form.fav_id)])
      setTempFavoriteAddress([res?.data?.data, ...favoriteAddressList.filter(item => item.id !== editFavoriteAddress_form.fav_id)])
      Toastr({ "message": res?.data?.message, type: 'success' });
      setLoading(false);
      return true;
    } else {
      Toastr({ "message": res?.data?.message, type: 'error' });
      setLoading(false);
      return false;
    }
  } catch (error) {
    console.log('editFavoriteAddress:::', error);
    Toastr({ "message": "An error occurred!", type: 'error' });
    setLoading(false);
    return false;
  }
};

// Delete Favorite Address
export const deleteFavoriteAddress = async (favAddress_id) => {

  const { setSelectedFavoriteAddressIndex, setFavoriteAddressDetails, favoriteAddressList, setFavoriteAddressList, setTempFavoriteAddress } = useFavoriteAddressStore.getState();

  try {
    setLoading(true)
    const res = await axios.post(kuDeleteFavoriteAddress, { fav_id: favAddress_id });
    console.log('deleteFavoriteAddress:::', res.data);
    if (res?.data?.success) {
      Toastr({ "message": res?.data?.message, type: 'success' });
      setSelectedFavoriteAddressIndex(0)
      const data = favoriteAddressList.filter(item => item?.id !== favAddress_id)
      setFavoriteAddressList(data)
      setTempFavoriteAddress(data)
      setFavoriteAddressDetails(favoriteAddressList[0])
      // getFavoriteAddress();
      setLoading(false)
      return true;
    } else {
      Toastr({ "message": res?.data?.message, type: 'error' });
      setLoading(false)
      return false;
    }
  } catch (error) {
    console.log('deleteFavoriteAddress:::', error);
    Toastr({ "message": "An error occurred!", type: 'error' });
    setLoading(false);
    return false;
  }
};

//Search Favorite Address
export const searchFavoriteAddress = (searchValue) => {

  const { setFavoriteAddressList, tempFavoriteAddress, setFavoriteAddressDetails, setSelectedFavoriteAddressIndex, setAddAddressLabel } = useFavoriteAddressStore.getState();

  setLoadingSearch(true);
  setFavoriteAddressDetails({})
  setSelectedFavoriteAddressIndex("")
  // eslint-disable-next-line array-callback-return
  const result = tempFavoriteAddress.filter((item) => {
    if (
      item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.address.toLowerCase().includes(searchValue.toLowerCase())
    ) {
      return item;
    }
  });

  setLoadingSearch(false)
  setAddAddressLabel("")
  setFavoriteAddressList(result);
};

//select Favorite Address
export const selectFavoriteAddress = async (item) => {

  const { setSelectedFavoriteAddressIndex, setFavoriteAddressDetails, favoriteAddressList, setFavoriteAddressList, } = useFavoriteAddressStore.getState();

  await setFavoriteAddressDetails(item);
  await setFavoriteAddressList([item, ...favoriteAddressList?.filter(i => i?.id !== item?.id)])
  setSelectedFavoriteAddressIndex(0);
}