import axios from "axios";
import { create } from "zustand";
import { kuAddCar, kuAllCar, kuDeleteCar, kuGetCarLicense, kuRenewCarLicense, kuUpdateCar } from "../../urls/companyUrl";
import { Toastr } from "../../utility/utilityFunctions";
import useGeneralStore from '../others/generalStore';
import useUtilityStore from "../others/utilityStore";

const { setLoading } = useGeneralStore.getState();
const { setLoadingSearch } = useUtilityStore.getState();

const useCarStore = create((set, get) => ({

  allCarList: [],
  setAllCarList: (value) => set({ allCarList: value }),

  allCarListTemp: [],
  setAllCarListTemp: (value) => set({ allCarListTemp: value }),

  allCarLicenseList: [],
  setAllCarLicenseList: (value) => set({ allCarLicenseList: value }),

  selectedCarIndex: 0,
  setSelectedCarIndex: (value) => set({ selectedCarIndex: value }),

  carDetails: {},
  setCarDetails: (value) => set({ carDetails: value }),

  carSearchKey: '',
  setCarSearchKey: (value) => set({ carSearchKey: value }),

  carLicenseRenewID: -1,
  setCarLicenseRenewID: (value) => set({ carLicenseRenewID: value }),

  licenseAddUpdateForm: {
    id: 0,
    license_id: 0,
    license_start: '',
    purchase_license_comment: '',

  },
  setLicenseAddUpdateForm: (value) => set({ licenseAddUpdateForm: value }),
  resetLicenseAddUpdateForm: () => set({
    licenseAddUpdateForm: {
      id: 0,
      license_id: 0,
      license_start: '',
      purchase_license_comment: '',

    }
  }),

  updateCarForm: {
    id: 0,
    name: '',
    license_id: '',
    car_license_plate_number: '',
    license_start: '',
    image: '',
    comment: '',
  },
  setUpdateCarForm: (value) => set({ updateCarForm: value }),

  addCarForm: {
    id: 0,
    name: '',
    license_id: '',
    car_license_plate_number: '',
    license_start: '',
    image: '',
    comment: '',
  },
  setAddCarForm: (value) => set({ addCarForm: value }),
  resetAddCarForm: () => set({
    addCarForm: {
      id: 0,
      name: '',
      license_id: '',
      car_license_plate_number: '',
      license_start: '',
      image: '',
      comment: '',
    }
  }),

  //All Modal

  showAddCarModal: false,
  setShowAddCarModal: (value) => set({ showAddCarModal: value }),

  showEditCarModal: false,
  setShowEditCarModal: (value) => set({ showEditCarModal: value }),

  showCarLicensePackageModal: false,
  setShowCarLicensePackageModal: (value) => set({ showCarLicensePackageModal: value }),

  showCarDeleteModal: false,
  setShowCarDeleteModal: (value) => set({ showCarDeleteModal: value }),

  showCarLicenseSkip: false,
  setShowCarLicenseSkip: (value) => set({ showCarLicenseSkip: value }),

}));

export default useCarStore;

// *******************************
//e      handler functions
// *******************************

//g        search car (local)   
export const searchCarList = async (searchKey) => {
  const { setAllCarList, allCarListTemp } = useCarStore.getState();
  try {
    setLoadingSearch(true);
    const result = allCarListTemp.filter((item) => {
      if (
        item.name.toLowerCase().includes(searchKey.toLowerCase()) ||
        item.license_status.toLowerCase().includes(searchKey.toLowerCase()) ||
        item.car_license_plate_number.toLowerCase().includes(searchKey.toLowerCase())
      ) {
        return item;
      } else return null;
    });

    // console.log("searchKey: ", searchKey, "result: ", result);

    setAllCarList(result);
    setLoadingSearch(false);
  } catch (err) {
    console.log('searchCarList: ', err);
    Toastr({ message: "An error occurred!" });
    setLoadingSearch(false);
  }
};


// ***********************
//        api calls
// ***********************

// get all cars index
export const getAllCar = async (setFirstItemSelected = true) => {
  const { setAllCarList, setSelectedCarIndex, setCarDetails, setUpdateCarForm, setAllCarListTemp, setCarSearchKey } = useCarStore.getState();
  try {
    setLoading(true);
    const res = await axios.get(kuAllCar);
    console.log('getAllCar: ', res.data);

    if (res.data.success) {
      setAllCarList(res.data.data?.slice().reverse());
      setAllCarListTemp(res.data.data?.slice().reverse());
      setCarSearchKey('');

      if (setFirstItemSelected) {
        setCarDetails(res.data.data?.slice().reverse()[0]);      //y   setting the first item of the list as selected item 
        setSelectedCarIndex(0);
        setUpdateCarForm(res.data.data?.slice().reverse()[0]);      //e   same for editing purpose 
      }
    } else {
      Toastr({ message: res.data.message });
    }

    setLoading(false);
  } catch (err) {
    console.log('getAllCar: ', err);
    Toastr({ message: "An error occurred!" });
    setLoading(false);
  }
};

// get license list
export const getAllLicenseList = async () => {
  const { setAllCarLicenseList } = useCarStore.getState();
  try {
    setLoading(true);
    const res = await axios.get(kuGetCarLicense);
    console.log('getAllLicenseList: ', res.data);
    if (res.data.success) {
      setAllCarLicenseList(res.data.data);
    } else {
      Toastr({ message: res.data.message });
    }
    setLoading(false);
  } catch (err) {
    console.log('getAllLicenseList: ', err);
    Toastr({ message: "An error occurred!" });
    setLoading(false);
  }
};

//l    apply license or update
export const updateOrApplyForLicense = async (data, doRenew = false) => {      // in order to update a license, use: [ doRenew = true ]
  const { setCarDetails, selectedCarIndex, allCarList, setAllCarList, setAllCarListTemp } = useCarStore.getState();

  // return console.log('data: ', data, '\n doRenew:', doRenew);
  try {
    let body = {};
    if (doRenew) {
      body = {
        id: data?.id,
        license_id: data?.license_id,
        renew_license_start: data?.license_start,
        purchase_license_comment: data?.purchase_license_comment,
      };
    } else {
      body = {
        id: data?.id,
        license_id: data?.license_id,
        license_start: data?.license_start,
        purchase_license_comment: data?.purchase_license_comment,
      };
    }

    setLoading(true)
    // console.log("Body before axios:::", body);
    let res = {};
    if (doRenew) {
      res = await axios.post(kuRenewCarLicense, body);
    } else {
      res = await axios.post(kuUpdateCar, body);
    }
    console.log('UpdateApplyForLicense: ', res.data);

    if (res.data.success) {
      // await getAllCar(false);

      let t_car_list = [...allCarList];
      t_car_list[selectedCarIndex] = res.data.data;
      setAllCarList(t_car_list);
      setAllCarListTemp(t_car_list);

      setCarDetails(res.data.data);
      setLoading(false);
      return true;
    } else {
      Toastr({ message: res.data.message });
      setLoading(false);
      return false;
    }

  } catch (err) {
    console.log('UpdateApplyForLicense: ', err);
    Toastr({ message: "An error occurred!" });
    setLoading(false);
  }
};

//  add car data
export const addCar = async (data, imgUpdated = false) => {
  const { addCar, allCarList, setAllCarList, setAllCarListTemp, setCarDetails } = useCarStore.getState();
  try {
    setLoading(true);

    console.log("addCarForm: ", data);

    if (addCar?.car_license_plate_number?.length > 9) {
      Toastr({ message: "License number max 9 characters", type: "warning" });
      setLoading(false);
      return;
    }
    let body = {};
    if (imgUpdated) {
      body = {
        id: data?.id,
        name: data?.name,
        car_license_plate_number: data?.car_license_plate_number,
        image: data?.image,
        comment: data?.comment,

      };
    } else {
      body = {
        id: data?.id,
        name: data?.name,
        car_license_plate_number: data?.car_license_plate_number,
        comment: data?.comment,

      };
    }

    const res = await axios.post(kuAddCar, body);

    console.log('addCar - after axios: ', res.data.data.car);

    if (res.data.success) {
      // await getAllCar(false);

      let t_car_list = [...allCarList];
      t_car_list.unshift(res.data.data.car);
      setAllCarList(t_car_list);
      setAllCarListTemp(t_car_list);

      setCarDetails(res.data.data.car);      //y   setting the last item of the list as selected item 
      // setSelectedCarIndex(allCarList?.length);      //e   to select the last item of the list 

      setLoading(false);
      return true;
    } else {
      setLoading(false);
      Toastr({ message: res.data.message });
      return false;
    }

  } catch (error) {
    console.log('addCar: ', error);
    Toastr({ message: "An error occurred!" });
    setLoading(false);
    return false;
  }
}

//  update car data
export const updateCar = async (data, imageUpdated = false) => {
  const { updateCar, setCarDetails, selectedCarIndex, allCarList, setAllCarList, setAllCarListTemp } = useCarStore.getState();
  try {
    setLoading(true);

    console.log("updateCarForm: ", data);

    if (updateCar?.car_license_plate_number?.length > 9) {
      Toastr({ message: "License number must be 9 digits", type: "warning" });
      setLoading(false);
      return;
    }
    let body = {};
    if (imageUpdated) {
      body = {
        id: data?.id,
        name: data?.name,
        car_license_plate_number: data?.car_license_plate_number,
        image: data?.image,
        comment: data?.comment,

      };
    } else {
      body = {
        id: data?.id,
        name: data?.name,
        car_license_plate_number: data?.car_license_plate_number,
        comment: data?.comment,
      };
    }

    console.log('updateCar - BODY: ', body);

    const res = await axios.post(kuUpdateCar, body);

    console.log('updateCar - after axios: ', res.data);

    if (res.data.success) {
      // await getAllCar(false);

      let t_car_list = [...allCarList];
      t_car_list[selectedCarIndex] = res.data.data;
      setAllCarList(t_car_list);
      setAllCarListTemp(t_car_list);

      setCarDetails(res?.data?.data);

      setLoading(false);
      return true;
    } else {
      Toastr({ message: res.data.message });
      setLoading(false);
      return false;
    }

  } catch (error) {
    console.log('updateCar: ', error);
    Toastr({ message: "An error occurred!" });
    setLoading(false);
    return false;
  }
}


// delete car 
export const deleteCar = async (car_id) => {
  const { setSelectedCarIndex, allCarList, setAllCarList, setCarDetails } = useCarStore.getState();
  try {
    setLoading(true);

    const body = { id: car_id };
    console.log(body);
    const res = await axios.post(kuDeleteCar, body);
    console.log('deleteCar', res.data);

    if (res.data.success) {
      await getAllCar();
      let t_car_list = [...allCarList];
      t_car_list = t_car_list.filter((item) => item.id !== car_id);
      setAllCarList(t_car_list);

      setCarDetails(allCarList[0]);

      setSelectedCarIndex(0);
      setLoading(false);
      return true;
    } else {
      Toastr({ message: res.data.message });
      setLoading(false);
      return false;
    }

  } catch (err) {
    console.log('deleteCar', err);
    Toastr({ message: "An error occurred!" });
    setLoading(false);
    return false;
  }
};