import axios from 'axios';
import { create } from 'zustand';
import { create_request_steps, create_request_type, k_cr_actions, k_cr_status, user_role as role, user_role } from '../../utility/const';
import useGeneralStore from './generalStore';
import { kuEditInBidding, kuGetInitData, kuRequestSave, kuSearchCompany } from '../../urls/commonUrl';
import { formatDate, formatTime, Toastr } from '../../utility/utilityFunctions';
import { t } from 'i18next';

const useCreateRequestStore = create((set, get) => ({
  request_type: create_request_type.normal,
  setCreateRequestType: (data) => set({ request_type: data }),
  current_step: create_request_steps.pickup, //pickup, mass_import, select_company
  setCurrentSetup: (data) => set({ current_step: data }),
  is_show_request_confirm_modal: false,
  setShowRequestConfirmModal: (data) => set({ is_show_request_confirm_modal: data }),
  is_show_generate_table_modal: false,
  setShowGenerateTableModal: (data) => set({ is_show_generate_table_modal: data }),
  stops: [],
  setStops: (data) => set({ stops: data }),
  is_mass_import_form_fullscreen: false,
  setMassImportFormFullscreen: (data) => set({ is_mass_import_form_fullscreen: data }),

  cr_data: null,
  setCrData: (data) => set({ cr_data: data }),
  cr_form: {
    id: null,
    is_web: true,
    action: k_cr_actions.save,
    is_mass: false,
    is_global: 0,
    status: k_cr_status.init,

    // pickup
    title: '',
    transport_type: '',
    pickup_date: '',
    pickup_date_formatted: '',
    pickup_start_time: '',
    pickup_end_time: '',
    pickup_address: '',
    pickup_lat: '',
    pickup_lng: '',
    pickup_comment: '',
    pickup_attachment: '',
    pickup_attachment_url: '',
    temp_pickup_attachment: null,
    has_old_image: 0,

    // deliveries
    stops: [
      {
        date: '',
        formatted_date: '',
        start_time: '',
        end_time: '',
        delivery_time: '',
        address: '',
        lat: '',
        lng: '',
        comment: '',
        attachment: '',
        attachment_url: '',
        temp_attachment: null,
        products: [{ text: '' },],
        has_old_image: 0,
      },
    ],

    // for customer
    invitation_ids: [],
    invitation_data: [], // selected companies

    // for company
    shift_plan: null,
    shift_id: null,
    bid_details: '',
    budget: '',
  },
  setCrFullForm: (data) => set({ cr_form: data }),
  setCrForm: (e) => set({ cr_form: { ...get().cr_form, [e.target.name]: e.target.value } }),
  changeCrForm: (name, value) => set({ cr_form: { ...get().cr_form, [name]: value } }),
  updateStopsForm: (index, name, value) => {
    let x = [...get().cr_form?.stops];
    x[index][name] = value;
    let y = get().cr_form;
    y.stops = x;

    set({ cr_form: y });
  },
  clearCrFormData: (value) => set({ cr_form: value }),
  resetCreateRequest: () => {
    get().setCrData(null);
    set({
      cr_form: {
        id: null,
        is_web: true,
        action: k_cr_actions.save,
        is_mass: false,
        is_global: false,
        status: k_cr_status.init,

        // pickup
        title: '',
        transport_type: '',
        pickup_date: '',
        pickup_date_formatted: '',
        pickup_start_time: '',
        pickup_end_time: '',
        pickup_address: '',
        pickup_lat: '',
        pickup_lng: '',
        pickup_comment: '',
        pickup_attachment: '',
        pickup_attachment_url: '',
        temp_pickup_attachment: null,

        // deliveries
        stops: [
          {
            date: '',
            formatted_date: '',
            start_time: '',
            end_time: '',
            delivery_time: '',
            address: '',
            lat: '',
            lng: '',
            comment: '',
            attachment: '',
            attachment_url: '',
            temp_attachment: null,
            products: [{ text: '' },],
            has_old_image: 0,
          },
        ],

        // for customer
        invitation_ids: [],
        invitation_data: [], // selected companies

        // for company
        shift_plan: null,
        shift_id: null,
        bid_details: '',
        budget: '',
      }
    });
  },

  addDelivery: () => {
    let x = get().cr_form?.stops;
    x.push({
      date: '',
      formatted_date: '',
      start_time: '',
      end_time: '',
      delivery_time: '',
      address: '',
      lat: '',
      lng: '',
      comment: '',
      attachment: '',
      attachment_url: '',
      temp_attachment: null,
      products: [{ text: '' },],
      has_old_image: 0,
    },);

    let y = get().cr_form;
    y.stops = x;

    set({ cr_form: y });
  },

  removeDelivery: (index) => {
    let x = get().cr_form?.stops;
    let newDelivery = [...x];
    newDelivery.splice(index, 1);

    let y = get().cr_form;
    y.stops = [...newDelivery];

    set({ cr_form: y });
  },

  addDeliveryProduct: (index) => {
    let x = [...get().cr_form?.stops];
    x[index].products.push({ text: '' });
    let y = get().cr_form;
    y.stops = x;

    set({ cr_form: y });
  },

  removeDeliveryProduct: (index, productIndex) => {
    let x = [...get().cr_form?.stops];
    x[index].products.splice(productIndex, 1);

    let y = get().cr_form;
    y.stops = x;

    set({ cr_form: y });
  },

  changeProductValue: (value, index, productIndex) => {
    let x = get().cr_form?.stops[index]?.products[productIndex];
    x = value;
    let y = get().cr_form;
    y.stops[index].products[productIndex].text = x;

    set({ cr_form: y });
  },

  favorite_companies: [],
  setFavoriteCompanies: (data) => set({ favorite_companies: data }),
  favorite_addresses: [],
  setFavoriteAddresses: (data) => set({ favorite_addresses: data }),
  type_of_transportation: [],
  setTypeofTransportation: (data) => {
    let x = [];
    data.forEach(element => {
      x.push({ title: element?.title, value: element?.title })
    });
    set({ type_of_transportation: x })
  },

  is_fav_selected: false,
  setFavSelected: (value) => set({ is_fav_selected: value }),
  rate: 0,
  setRate: (value) => set({ rate: value }),
  search_company_key: '',
  setSearchCompanyKey: (value) => set({ search_company_key: value }),
  company_search_result: [],
  setCompanySearchResult: (value) => set({ company_search_result: value }),
  is_company_searching: false,
  setIsCompanySearching: (value) => set({ is_company_searching: value }),

  available_companies: [],
  setAvailableCompanies: (data) => set({ available_companies: data }),

  selected_companies: [],
  setSelectedCompanies: (data) => {
    set({ selected_companies: data });
    handleCompany();
    let x = [];
    data?.forEach(element => {
      x.push(element?.id);
    });
    get().changeCrForm('invitation_ids', x);
  }

}))


export default useCreateRequestStore;


//! API calls
const { setLoading } = useGeneralStore.getState();

export const getInitData = async () => {
  // setLoading(true);
  const { setFavoriteCompanies, setFavoriteAddresses, setTypeofTransportation } = useCreateRequestStore.getState();

  try {
    const res = await axios.get(kuGetInitData);
    console.log(res.data);
    if (res.data.success) {
      setFavoriteCompanies(res?.data?.data?.favorite_companies);
      setFavoriteAddresses(res?.data?.data?.favorite_addresses);
      setTypeofTransportation(res?.data?.data?.transportation_types);
    } else {
      Toastr({ message: res.data.message });
    }
    // setLoading(false);
  } catch (err) {
    console.log(err);
    Toastr({ message: t("An error occurred!") });
    // setLoading(false);
  }
}

export const saveRequest = async (action = k_cr_actions.save) => {
  const validate = (action === k_cr_actions.next || action === k_cr_actions.submit) ? validateCrForm() : true;

  if (!validate) {
    Toastr({ message: 'Please filled up all required fields!', type: 'warning' });
    return;
  }

  const { cr_form, setCrData } = useCreateRequestStore.getState();
  const data = { ...cr_form, budget: parseInt(cr_form?.budget?.toString()), action: action }
  setLoading(true);

  console.log('saveRequest before: ', data);

  try {
    const res = await axios.post(kuRequestSave, data);
    console.log('saveRequest after: ', res?.data?.data);

    if (res?.data?.success) {
      setCrData(res?.data?.data);
      loadCreateRequestData(res?.data?.data);
      setLoading(false);
      Toastr({ message: res?.data?.message, type: 'success' });
      return true;
    } else {
      Toastr({ message: res?.data?.message });
      setLoading(false);
      return false;
    }


  } catch (err) {
    console.log('saveRequest', err);
    console.log('saveRequest', err?.response);
    Toastr({ message: t("An error occurred!") });
    setLoading(false);
    return false;
  }
}

export const editRequest = async (id) => {
  if (id === null) {
    Toastr({ message: t("Invalid request!"), type: "warning" })
    return
  }

  setLoading(true);

  try {
    const res = await axios.post(kuEditInBidding, { id: id, is_web: 1 });
    console.log('editRequest: ', res?.data?.data);

    if (res.data.success) {
      setLoading(false);
      return true;
    } else {
      Toastr({ message: res?.data?.message })
      setLoading(false);
      return false;
    }


  } catch (err) {
    console.log('editRequest: ', err);
    Toastr({ message: t("An error occurred!") })
    setLoading(false);
    return false;
  }
}

export const searchCompany = async (text, rate) => {
  const { setCompanySearchResult, setIsCompanySearching } = useCreateRequestStore.getState();
  // console.log('rate', rate);
  try {
    if (rate === 0) rate = null
    setIsCompanySearching(true);
    const res = await axios.get(kuSearchCompany, { params: { search: text, rate: rate } });

    console.log('searchCompany', res?.data?.data);
    if (res?.data?.success) {
      setCompanySearchResult(res?.data?.data);
    } else {
      Toastr({ message: res?.data?.message })
    }
    setIsCompanySearching(false);
  } catch (err) {
    console.log(err);
    Toastr({ message: t('An error occurred!') });
    setIsCompanySearching(false);
  }
}


//! helpers functions
export const generateCreateRequestSummaryContent = () => {
  const { cr_form } = useCreateRequestStore.getState();
  const data = cr_form;
  return [
    { title: 'Title', description: data?.title?.length > 0 ? data?.title : 'NA' },
    { title: 'Transportation Type', description: data?.transport_type?.length > 0 ? data?.transport_type : 'NA' },
    { title: 'Pickup Date', description: formatDate(data?.pickup_date) ?? 'NA' },
    { title: 'Pickup Time', description: data?.pickup_start_time ? (formatTime(data?.pickup_start_time) ?? '--') + ' - ' + (formatTime(data?.pickup_end_time) ?? '--') : 'NA' },
    { title: 'Delivery Overview', description: `${data?.stops?.length} Stops (${countAllStopsProducts(data?.stops)} Packages)` },
  ];
}

export const generateCreateRequestSummaryContent2 = () => {
  const { cr_form, current_step } = useCreateRequestStore.getState();
  const { user_role } = useGeneralStore.getState();
  const data = cr_form;

  if (user_role === role.company && current_step === create_request_steps.select_shift) {
    return [
      { title: 'Driver Name', description: data?.shift_plan?.driver_user?.name ?? 'NA' },
      { title: 'Vehicle Number', description: data?.shift_plan?.car?.car_license_plate_number ?? 'NA' },
    ];
  }

  if (user_role === role.customer && current_step === create_request_steps.select_company) {
    return [
      { title: 'Direct Invite', description: cr_form?.invitation_ids?.length ?? 0 },
      { title: 'Global Invite', description: cr_form?.is_global ? 'Submitted' : 'Not Submitted' },
    ];
  }

}

export const countAllStopsProducts = (stops) => {
  let x = 0;
  stops.forEach(element => {
    let y = 0;
    element?.products?.forEach(product => {
      if (product?.text && product?.text?.length > 0) y++;
    })
    x += y;
  });

  return x;
}

export const clearCrForm = () => {
  const { user_role } = useGeneralStore.getState();
  const { current_step, cr_form, clearCrFormData } = useCreateRequestStore.getState();

  if (user_role === role.customer) {
    if (current_step === create_request_steps.pickup) {
      let x = {
        ...cr_form,
        title: '',
        transport_type: '',
        pickup_date: '',
        pickup_date_formatted: '',
        pickup_start_time: '',
        pickup_end_time: '',
        pickup_avg: '',
        pickup_address: '',
        pickup_lat: '',
        pickup_lng: '',
        pickup_comment: '',
        pickup_attachment: '',
        temp_pickup_attachment: null,
        pickup_attachment_url: '',

        // deliveries
        stops: [
          {
            address: '',
            lat: '',
            lng: '',
            comment: '',
            attachment: '',
            attachment_url: '',
            temp_attachment: null,
            products: [{ text: '' },],
            has_old_image: 0,
          },
        ],
      };
      clearCrFormData(x);
    }

    if (current_step === create_request_steps.select_company) {
      const { setSearchCompanyKey, setSelectedCompanies, setRate } = useCreateRequestStore.getState();
      let x = {
        ...cr_form,
        is_global: 0,
      }
      clearCrFormData(x);
      setSearchCompanyKey('');
      setSelectedCompanies([]);
      setRate(0);
    }

  } else if (user_role === role.company) {
    if (current_step === create_request_steps.pickup) {

      let x = {
        ...cr_form,
        title: '',
        transport_type: '',
        pickup_date: '',
        pickup_date_formatted: '',
        pickup_start_time: '',
        pickup_end_time: '',
        pickup_avg: '',
        pickup_address: '',
        pickup_lat: '',
        pickup_lng: '',
        pickup_comment: '',
        pickup_attachment: '',
        temp_pickup_attachment: null,
        pickup_attachment_url: '',

        // deliveries
        stops: [
          {
            date: '',
            formatted_date: '',
            start_time: '',
            end_time: '',
            delivery_time: '',
            address: '',
            lat: '',
            lng: '',
            comment: '',
            attachment: '',
            attachment_url: '',
            temp_attachment: null,
            products: [{ text: '' },],
            has_old_image: 0,
          },
        ],
      };
      clearCrFormData(x);
    }

    if (current_step === create_request_steps.select_shift) {
      let x = {
        ...cr_form,
        shift_plan: null,
        shift_id: null,
        bid_details: '',
        budget: '',

      };
      clearCrFormData(x);
    }
  }
}

export const validateCrForm = () => {
  const { cr_form, current_step } = useCreateRequestStore.getState();
  const { user_role } = useGeneralStore.getState();
  let required_fields = [];

  if (current_step === create_request_steps.pickup) {
    if (cr_form?.title === '' || !cr_form?.title) {
      required_fields.push('Pickup Title');
    } else if (cr_form?.transport_type === '' || !cr_form?.transport_type) {
      required_fields.push('Transportation Type');
    } else if (cr_form?.pickup_date === '' || !cr_form?.pickup_date) {
      required_fields.push('Pickup Date');
    } else if (cr_form?.pickup_start_time === '' || !cr_form?.pickup_start_time) {
      required_fields.push('Pickup start time');
    } else if (cr_form?.pickup_end_time === '' || !cr_form?.pickup_end_time) {
      required_fields.push('Pickup end time');
    } else if (cr_form?.pickup_address === '' || !cr_form?.pickup_address) {
      required_fields.push('Pickup address');
    } else if (cr_form?.pickup_lat === '' || !cr_form?.pickup_lat) {
      required_fields.push('Pickup address');
      Toastr({ message: 'Invalid pickup address', type: 'info' });
    } else if (cr_form?.pickup_lng === '' || !cr_form?.pickup_lng) {
      required_fields.push('Pickup address');
      Toastr({ message: 'Invalid pickup address', type: 'info' });
    } else if (cr_form?.pickup_date && cr_form?.pickup_start_time) {
      const res = pickupDateTimeValidation(cr_form?.pickup_date, cr_form?.pickup_start_time);
      if (!res) required_fields.push('Pickup start time');
    }

    if (user_role === role.customer) {
      cr_form?.stops?.forEach((stop, index) => {
        if (stop?.address === '' || !stop?.address) {
          required_fields.push('Delivery address');
        } else if (stop?.lat === '' || !stop?.lat) {
          required_fields.push('Delivery address');
          Toastr({ message: `Invalid delivery ${index + 1} address`, type: 'info' });
        } else if (stop?.lng === '' || !stop?.lng) {
          required_fields.push('Delivery address');
          Toastr({ message: `Invalid delivery ${index + 1} address`, type: 'info' });
        }

        if (stop?.products?.length > 0) {
          stop?.products?.forEach(product => {
            if (!product?.text || product?.text?.length === 0) {
              required_fields.push('Product');
            }
          });
        }
      });
    } else if (user_role === role.company) {
      cr_form?.stops?.forEach((stop, index) => {
        if (stop?.date === '' || !stop?.date) {
          required_fields.push('Delivery Date');
        } else if (stop?.start_time === '' || !stop?.start_time) {
          required_fields.push('Delivery start time');
        } else if (stop?.end_time === '' || !stop?.end_time) {
          required_fields.push('Delivery end time');
        } else if (stop?.address === '' || !stop?.address) {
          required_fields.push('Delivery address');
        } else if (stop?.lat === '' || !stop?.lat) {
          required_fields.push('Delivery address');
          Toastr({ message: `Invalid delivery ${index + 1} address`, type: 'info' });
        } else if (stop?.lng === '' || !stop?.lng) {
          required_fields.push('Delivery address');
          Toastr({ message: `Invalid delivery ${index + 1} address`, type: 'info' });
        } else if (stop?.date && stop?.start_time && cr_form?.pickup_date && cr_form?.pickup_start_time) {
          const res = deliveryDateTimeValidation(stop?.date, stop?.start_time, cr_form?.pickup_date, cr_form?.pickup_start_time, index);
          if (!res) required_fields.push('Delivery time');
        }
        if (stop?.products?.length > 0) {
          stop?.products?.forEach(product => {
            if (!product?.text || product?.text?.length === 0) {
              required_fields.push('Product');
            }
          });
        }
      });
    }
  }



  if (required_fields?.length > 0) {
    console.log('fields', required_fields);
    return false;
  }
  else return true;

}

export const pickupDateTimeValidation = (pickup_date, pickup_time) => {
  const pickup_date_time = new Date(pickup_date + " " + pickup_time);
  const current_date_time = new Date();
  if (pickup_date_time < current_date_time) {
    Toastr({ message: 'Invalid pickup date time! You must select a future date time!', type: "info" })
    return false
  } else return true;
}

export const deliveryDateTimeValidation = (data, time, pickup_date, pickup_time, index) => {
  const date_time = new Date(data + " " + time);
  const pickup_date_time = new Date(pickup_date + " " + pickup_time);
  if (date_time < pickup_date_time) {
    Toastr({ message: `Invalid delivery ${index + 1} date time! You must select a future date time from pick up!`, type: "info" })
    return false
  } else return true;
}

export const loadCreateRequestData = (data) => {
  const { setCrFullForm, cr_form, setSelectedCompanies } = useCreateRequestStore.getState();
  let stops = data?.stops;
  let y = [];
  stops.forEach((stop, index) => {
    y.push({
      ...stop,
      start_time: formatTime(stop?.start_time),
      end_time: formatTime(stop?.end_time),
      date: stop?.date,
      formatted_date: formatDate(stop?.date),
      has_old_image: stop?.attachment ? 1 : 0,
      attachment: cr_form?.stops[index]?.temp_attachment,
      temp_attachment: cr_form?.stops[index]?.temp_attachment,
      attachment_url: stop?.attachment,
      lat: stop?.address_lat,
      lng: stop?.address_lng,
    });
  });

  let x = {
    ...data,
    pickup_start_time: formatTime(data?.pickup_start_time),
    pickup_end_time: formatTime(data?.pickup_end_time),
    pickup_date: data?.pickup_date,
    pickup_date_formatted: formatDate(data?.pickup_date),
    has_old_image: data?.pickup_attachment ? 1 : 0,
    pickup_attachment: cr_form?.temp_pickup_attachment,
    temp_pickup_attachment: cr_form?.temp_pickup_attachment,
    pickup_attachment_url: data?.pickup_attachment,
    shift_id: data?.shift_plan?.id,
    bid_details: data?.my_bid?.details,
    budget: data?.my_bid?.budget === 0 ? null : data?.my_bid?.budget,
    is_web: true,
    shift_plan: { ...data?.shift_plan, driver_user: data?.driver, car: { car_license_plate_number: data?.car_license_number } },

    stops: y,
  }
  setCrFullForm(x);
  console.log('form', x);

  if (user_role === role.customer) {

  }
  let z = [];
  data?.invitation_data?.forEach(element => {
    let y = { ...element, id: element?.user_id }
    z.push(y);
  });
  setSelectedCompanies(z);
  console.log('zzz', z);
}

export const filterCompany = (data, key, rate) => {
  let x = data?.filter(item => {
    if (item?.name?.toLowerCase()?.includes(key?.toLowerCase()) && item?.rate <= rate) return item
    return null
  });
  return x;
}

export const handleCompany = () => {
  const { search_company_key, rate, company_search_result, setAvailableCompanies, favorite_companies, is_fav_selected, selected_companies } = useCreateRequestStore.getState();
  let x = [];

  if (is_fav_selected) {
    let a = filterCompany(favorite_companies, search_company_key ?? '', rate === 0 ? 5 : rate);
    x = [...company_search_result, ...a];

  }
  else x = [...company_search_result];

  x = x.filter(itemX => !selected_companies.some(itemY => itemX.id === itemY.id));

  setAvailableCompanies(x);
};