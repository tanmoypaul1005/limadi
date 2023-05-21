import axios from "axios";
import create from "zustand";
import { kuGetCompanyDetails, kuGetFavoriteCompany, kuGetNotFavoriteCompany, kuToggleFavCompany } from "../../urls/customerUrl";
import { Toastr } from "../../utility/utilityFunctions";
import useGeneralStore from "../others/generalStore";
import useUtilityStore from "../others/utilityStore";
const { setLoading } = useGeneralStore.getState();
const { setLoadingSearch } = useUtilityStore.getState();

const useFavoriteCompaniesStore = create((set) => ({

  favoriteCompanyList: [],
  setFavoriteCompanyList: (value) => set({ favoriteCompanyList: value }),

  tempFavoriteCompanyList: [],
  setTempFavoriteCompanyList: (value) => set({ tempFavoriteCompanyList: value }),

  notFavoriteCompanyList: [],
  setNotFavoriteCompanyList: (value) => set({ notFavoriteCompanyList: value }),

  notFavoriteCompanyTmpList: [],
  setNotFavoriteCompanyTmpList: (value) => set({ notFavoriteCompanyTmpList: value }),

  selectedNotFavId: "",
  setSelectedNotFavId: (value) => set({ selectedNotFavId: value }),

  selectedFavId: "",
  setSelectedFavId: (value) => set({ selectedFavId: value }),

  favoriteCompanyDetails: {},
  setFavoriteCompanyDetails: (value) => set({ favoriteCompanyDetails: value }),

  notFavoriteCompanyDetails: {},
  setNotFavoriteCompanyDetails: (value) => set({ notFavoriteCompanyDetails: value }),

  searchValueFavoriteCompany: null,
  setSearchValueFavoriteCompany: (value) => set({ searchValueFavoriteCompany: value }),

  searchValueNotFavoriteCompany: null,
  setSearchValueNotFavoriteCompany: (value) => set({ searchValueNotFavoriteCompany: value }),

  searchRating: 0,
  setSearchRating: (value) => set({ searchRating: value }),
  company_details: {},
  setCompanyDetails: (value) => set({ company_details: value }),

  // All modal
  showAddFavoriteCompaniesModal: false,
  setShowAddFavoriteCompaniesModal: (value) => set({ showAddFavoriteCompaniesModal: value }),

  showRemoveFavoriteCompanyModal: false,
  setShowRemoveFavoriteCompanyModal: (value) => set({ showRemoveFavoriteCompanyModal: value }),

  showCompanyDetailsModal: false,
  setShowCompanyDetailsModal: (value) => set({ showCompanyDetailsModal: value }),


}));

export default useFavoriteCompaniesStore;

// get FavoriteCompany
export const getFavoriteCompany = async () => {

  const { setFavoriteCompanyList, setTempFavoriteCompanyList, setSelectedFavId } = useFavoriteCompaniesStore.getState();

  try {
    setLoading(true);
    const res = await axios.get(kuGetFavoriteCompany);
    console.log("getFavoriteCompany: ", res?.data);
    if (res?.data?.success) {
      setFavoriteCompanyList(res?.data?.data?.slice().reverse());
      setTempFavoriteCompanyList(res?.data?.data);
      if (res?.data?.data?.slice().reverse()[0]?.id) {
        await setSelectedFavId(res?.data?.data?.slice().reverse()[0]?.id)
        await getCompanyDetails(res?.data?.data?.slice().reverse()[0]?.id);
      } else {
        Toastr({ "message": "Invalid user", type: 'error' });
      }
    } else {
      Toastr({ "message": res?.data?.message, type: 'error' });
    }
    setLoading(false);
  } catch (err) {
    console.log('getFavoriteCompany: ', err);
    Toastr({ "message": "An error occurred!", type: 'error' });
    setLoading(false);
  }
};

export const getNotFavoriteCompany = async (key = '', stars = []) => {

  const { setNotFavoriteCompanyList, setNotFavoriteCompanyTmpList } = useFavoriteCompaniesStore.getState();

  try {
    setLoadingSearch(true)
    const res = await axios.post(kuGetNotFavoriteCompany, { search: key, rate: JSON.stringify(stars) });
    console.log("getNotFavoriteCompany: ", res?.data);
    if (res?.data?.success) {
      setNotFavoriteCompanyList(res?.data?.data);
      setNotFavoriteCompanyTmpList(res?.data?.data);
    } else {
      Toastr({ "message": res?.data?.message, type: 'error' });
    }
    setLoadingSearch(false);
  } catch (err) {
    console.log('getNotFavoriteCompany: ', err);
    Toastr({ "message": "An error occurred!", type: 'error' });
    setLoadingSearch(false);
  }
};

// add/remove favorite company
export const addFavoriteCompany = async (isRefresh = false) => {

  const { setTempFavoriteCompanyList, setNotFavoriteCompanyTmpList, setSelectedFavId, setNotFavoriteCompanyList, notFavoriteCompanyList, selectedNotFavId, setFavoriteCompanyList, favoriteCompanyList } = useFavoriteCompaniesStore.getState();

  try {
    setLoading(true);
    if (selectedNotFavId) {
      const body = { id: selectedNotFavId };
      const res = await axios.post(kuToggleFavCompany, body);
      console.log('addFavoriteCompany(toggle): ', res.data);

      if (res?.data?.success) {
        if (isRefresh) {
          setFavoriteCompanyList([res?.data?.data, ...favoriteCompanyList]);
          setTempFavoriteCompanyList([res?.data?.data, ...favoriteCompanyList])

          await setSelectedFavId(res?.data?.data?.id)
          await getCompanyDetails(res?.data?.data?.id);

          setNotFavoriteCompanyList(notFavoriteCompanyList?.filter(item => item?.id !== res?.data?.data?.id));
          setNotFavoriteCompanyTmpList(notFavoriteCompanyList?.filter(item => item?.id !== res?.data?.data?.id))

        } else {
          getFavoriteCompany();
          getNotFavoriteCompany();
        }
        setLoading(false);
        return true;
      } else {
        Toastr({ "message": res?.data?.message, type: 'error' });
        setLoading(false);
        return false;
      }
    }
  } catch (err) {
    console.log('addFavoriteCompany(toggle): ', err);
    Toastr({ "message": "An error occurred!", type: 'error' });
    setLoading(false);
    return false;
  }
};

//SearchFavorite Company
export const searchFavCompany = (searchValue) => {
  const { tempFavoriteCompanyList, setFavoriteCompanyList, setFavoriteCompanyDetails, setSelectedFavId } = useFavoriteCompaniesStore.getState();
  setLoadingSearch(true);
  setFavoriteCompanyDetails({});
  setSelectedFavId(null)
  // eslint-disable-next-line array-callback-return
  const result = tempFavoriteCompanyList?.filter((item) => {
    const name = item?.name ?? "";
    if (
      name?.toLowerCase()?.includes(searchValue?.toLowerCase()) || item?.address?.toLowerCase().includes(searchValue?.toLowerCase())
    ) {
      return item;
    }
  });
  setLoadingSearch(false)
  setFavoriteCompanyList(result);
};

//get company Details
export const getCompanyDetails = async (id, isNotFav = false) => {

  const { setNotFavoriteCompanyDetails, setFavoriteCompanyDetails, setCompanyDetails } = useFavoriteCompaniesStore.getState();

  try {
    setLoading(true);

    const res = await axios.get(kuGetCompanyDetails, { params: { id: id }, });

    console.log('company details: ', res.data);

    if (res?.data?.success) {
      setCompanyDetails(res?.data?.data);
      if (isNotFav) {
        setNotFavoriteCompanyDetails(res?.data?.data)
      } else setFavoriteCompanyDetails(res?.data?.data);
    } else {
      Toastr({ "message": res?.data?.message, type: 'error' });
    }

    setLoading(false);
  } catch (err) {
    console.log('getCompanyDetails: ', err);
    Toastr({ "message": "An error occurred!", type: 'error' });
    setLoading(false);
  }
};

//select favorite company
export const selectFavoriteCompany = async (item, index) => {

  const { setSelectedFavId, setFavoriteCompanyList, favoriteCompanyList } = useFavoriteCompaniesStore.getState();

  await setSelectedFavId(item?.id);
  await setFavoriteCompanyList([item, ...favoriteCompanyList?.filter(i => i?.id !== item?.id)])
  await getCompanyDetails(item?.id);
}