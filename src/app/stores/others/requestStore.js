import axios from 'axios';
import { t } from 'i18next';
import { create } from 'zustand';
import RatingFiveStar from '../../../components/rating/RatingFiveStar';
import { kuAwardRequest, kuCancelRequestInvitation, kuDeleteRequestInvitationBidding, kuGetRequests, kuNotPlannedShiftAssign, kuRequestAcknowledge, kuRequestAction, kuRequestDelete, kuRequestDetails, kuShiftPlannerDetails, kuShiftPlannerList, kuSubmitRequestInvitationBidding, kuUpdateRequestInvitationBidding } from '../../urls/commonUrl';
import { kuAdvanceCalculation, kuFastCalculation } from '../../urls/companyUrl';
import { kuWriteReview } from '../../urls/customerUrl';
import { k_request_paths, k_request_types, user_role as role } from '../../utility/const';
import { iSavedReq, iInvitationNormal, iBiddingNormal, iAwardedNormal, iNotPlannedNormal, iOnGoingNormal, iCompletedNormal, iHistoryNormal, iSavedReqSelected, iHistorySelected } from '../../utility/imageImports';
import { checkPastTime, formatDate, formatDateOrTime, formatTime, Toastr } from '../../utility/utilityFunctions';
import useGeneralStore from './generalStore';

const useRequestStore = create((set, get) => ({
  requests_path: k_request_paths.saved,
  setRequestsPath: (path) => set(() => ({ requests_path: path })),
  requests: {},
  setRequests: (data) => {
    const { saved, invitation, in_bidding, awarded, ongoing, complete, history } = data;
    let not_planned = [];
    let planned = [];
    awarded.forEach((item) => {
      if (item.awarded_bidding.is_planned) planned.push(item);
      else not_planned.push(item);
    });

    if (useGeneralStore.getState().user_role === role.customer) {
      planned = [...planned, ...not_planned];
    }

    set({ requests: { saved, invitation, in_bidding, not_planned, planned, ongoing, complete, history } });
    get().setCurrentRequests(get().requests_path);
  },
  current_requests: [],
  setCurrentRequests: (path) => {
    const { saved, invitation, in_bidding, not_planned, planned, ongoing, complete, history } = get().requests;
    if (path === k_request_paths.saved) {
      set({ current_requests: saved });
      set({ temp_current_requests: saved });
    } else if (path === k_request_paths.invitation) {
      set({ current_requests: invitation });
      set({ temp_current_requests: invitation });
    } else if (path === k_request_paths.in_bidding) {
      set({ current_requests: in_bidding });
      set({ temp_current_requests: in_bidding });
    } else if (path === k_request_paths.not_planned) {
      set({ current_requests: not_planned });
      set({ temp_current_requests: not_planned });
    } else if (path === k_request_paths.awarded) {
      set({ current_requests: planned });
      set({ temp_current_requests: planned });
    } else if (path === k_request_paths.ongoing) {
      set({ current_requests: ongoing });
      set({ temp_current_requests: ongoing });
    } else if (path === k_request_paths.completed) {
      set({ current_requests: complete });
      set({ temp_current_requests: complete });
    } else if (path === k_request_paths.history) {
      set({ current_requests: history });
      set({ temp_current_requests: history });
    }
  },
  temp_current_requests: [],
  setTempCurrentRequests: (data) => set({ temp_current_requests: data }),
  setCurrentRequestsFromData: (data) => set({ current_requests: data }),
  requestsSearchKey: '',
  setRequestsSearchKey: (key) => set({ requestsSearchKey: key }),
  request_details: {},
  setRequestDetails: (data) => set({ request_details: data }),
  place_bid_form: { budget: '', description: '' },
  setPlaceBidForm: (e) => set({ place_bid_form: { ...get().place_bid_form, [e.target.name]: e.target.value } }),
  updatePlaceBidForm: (data) => set({ place_bid_form: data }),
  resetPlaceBidForm: () => set({ place_bid_form: { budget: '', description: '' } }),
  available_shifts: [],
  setAvailableShifts: (data) => {
    let x = [];
    for (let key in data) {
      x = [...x, ...data[key]];
    }
    set({ available_shifts: x });
  },
  shift_details: {},
  setShiftDetails: (data) => set({ shift_details: data }),
  selected_shift_index: null,
  setSelectedShiftIndex: (data) => set({ selected_shift_index: data }),
  is_fast_calculation: true,
  setIsFastCalculation: (data) => set({ is_fast_calculation: data }),

  fastCalculationData: null,
  setFastCalculationData: (data) => set({ fastCalculationData: data }),

  advanceCalculationData: null,
  setAdvanceCalculationData: (data) => set({ advanceCalculationData: data }),

  not_planned_stops: [],
  generateStops: (data) => {
    set({ not_planned_stops: [] });
    let x = [];
    data?.stops?.forEach(item => {
      const stop = {
        id: item.id,
        date: data.date,
        start_time: "",
        end_time: "",
      }
      x.push(stop);
    })
    set({ not_planned_stops: x });
    console.log('generateStops:', x);
  },
  updateStopInfo: (index, name, value) => {
    let x = get().not_planned_stops;
    x[index][name] = value;
    set({ not_planned_stops: x });
  },

}));

export default useRequestStore;

const { setLoading } = useGeneralStore.getState();

export const getRequests = async () => {
  const { setRequests } = useRequestStore.getState();
  setLoading(true);


  try {
    const res = await axios.get(kuGetRequests);
    console.log('getRequestIndex: ', res.data);

    if (res.data.success) setRequests(res?.data?.data);
    else Toastr({ message: res?.data?.message })

    setLoading(false)
  } catch (err) {
    Toastr(({ message: "An error occurred!" }))
    setLoading(false)
    console.log('getRequestIndex: ', err)
  }
};

export const getRequestDetails = async (type, id) => {
  if (!id) {
    Toastr({ message: "Invalid Request!" })
    return;
  }
  const { setRequestDetails } = useRequestStore.getState();

  const data_set = defineDataSet(type);

  setLoading(true);


  try {
    const res = await axios.get(kuRequestDetails, { params: { id: id, data_set: data_set } });
    console.log('getRequestDetails: ', res.data.data);

    if (res?.data?.success) {
      setRequestDetails(res?.data?.data);

    } else {
      Toastr({ message: res?.data?.message })
    }

    setLoading(false);
  } catch (err) {
    console.log('getRequestDetails: ', err);
    Toastr(({ message: "An error occurred!" }));
    setLoading(false);
  }
}

export const deleteRequest = async (request_id) => {
  if (!request_id) {
    Toastr({ message: "Invalid Request!" })
    return;
  }

  setLoading(true);
  try {
    const res = await axios.post(kuRequestDelete, { id: request_id });

    console.log('deleteRequest: ', res.data);
    if (res.data.success) {
      Toastr({ message: res.data.message, type: 'success' });
      setLoading(false);
      return true;
    } else {
      Toastr({ message: res.data.message })
      setLoading(false);
      return false;
    }
  } catch (err) {
    console.log('deleteRequest: ', err);
    Toastr(({ message: "An error occurred!" }));
    setLoading(false);
    return false;
  }
}

export const submitOrUpdateRequestInvitationBidding = async (type = 'submit', id, navigateTo, navigateLink) => {
  const { place_bid_form, resetPlaceBidForm } = useRequestStore.getState();

  if (!id) {
    Toastr({ message: t("Invalid Request!"), type: 'warning' });
    return;
  }

  setLoading(true)

  try {
    const res = await axios.post((type === 'submit' ? kuSubmitRequestInvitationBidding : kuUpdateRequestInvitationBidding),
      { id: id, budget: place_bid_form.budget, details: place_bid_form.description });

    console.log("submitOrUpdateRequestInvitationBidding: ", res.data);

    if (res.data.success) {
      Toastr({ message: res?.data?.message, type: 'success' });
      await getRequests();
      resetPlaceBidForm();
      setLoading(false);
      if (type === 'submit') navigateTo(navigateLink);
      return true;
    } else {
      Toastr({ message: res?.data?.message });
      setLoading(false);
      return false;
    }
  } catch (err) {
    console.log('submitOrUpdateRequestInvitationBidding: ', err);
    Toastr({ message: t("An error occurred!") });
    setLoading(false);
    return false;
  }
}

export const declineRequestInvitation = async (id, comment) => {
  if (!id) {
    Toastr({ message: t("Invalid Request!"), type: 'warning' });
    return;
  }

  setLoading(true)

  try {
    const res = await axios.post(kuCancelRequestInvitation, { req_id: id, decline_comment: comment });
    console.log("declineRequestInvitation: ", res.data);
    if (res.data.success) {
      setLoading(false)
      Toastr({ message: res?.data?.message, type: 'success' });
      return true;
    } else {
      Toastr({ message: res?.data?.message });
      setLoading(false)
      return false;
    }
  } catch (err) {
    console.log('declineRequestInvitation: ', err);
    Toastr({ message: t("An error occurred!") });
    setLoading(false)
    return false;
  }
}

export const getRequestShiftPlannerList = async (start_time, start_date) => {
  // console.log('date, time', start_date, start_time);
  if (!start_date || !start_time) {
    Toastr({ message: t("Invalid Shift Schedule!"), type: 'warning' });
    return;
  }

  setLoading(true);
  try {
    const res = await axios.get(kuShiftPlannerList + `?start_time=${start_time}&start_date=${start_date}&is_maintenance=${0}`);
    console.log("getRequestShiftPlannerList:", res.data);
    if (res.data.success) {
      useRequestStore.getState().setAvailableShifts(res.data.data);
    } else {
      Toastr({ message: res.data.message });
    }
    setLoading(false)
  } catch (err) {
    console.log('getRequestShiftPlannerList: ', err);
    Toastr({ message: t("An error occurred!") });
    setLoading(false)
  }
};

export const getShiftDetails = async (id) => {
  if (!id) {
    Toastr({ message: t("Invalid Shift!"), type: 'warning' });
    return;
  }

  const { setShiftDetails } = useRequestStore.getState();
  try {
    setLoading(true);
    const res = await axios.get(kuShiftPlannerDetails + `?id=${id}`);
    console.log("getShiftDetails:", res.data);

    if (res.data.success) {
      setShiftDetails(res.data.data);
    } else {
      Toastr({ message: res.data.message });
    }
    setLoading(false);
  } catch (err) {
    console.log('getShiftDetails: ', err);
    Toastr({ message: t("An error occurred!") });
    setLoading(false);
  }
};

export const requestAction = async (request_id, action, reason = null) => {
  setLoading(true);
  try {
    const res = await axios.post(kuRequestAction, { id: request_id, action: action, reason: reason });
    console.log('requestAction: ', res.data);

    if (res.data.success) {
      Toastr({ message: res?.data?.message, type: 'success' });
      setLoading(false);
      return false;
    } else {
      Toastr({ message: res?.data?.message })
      setLoading(false);
      return false;
    }

  } catch (err) {
    console.log('requestAction: ', err);
    Toastr({ message: t("An error occurred!") });
    setLoading(false);
    return false;
  }
}

export const deleteInBiddingRequest = async (bidding_id, dcr_comment) => {
  if (bidding_id === null) {
    Toastr({ message: t("Invalid Bidding!"), type: 'warning' });
    return;
  }

  setLoading(true)

  try {
    const res = await axios.post(kuDeleteRequestInvitationBidding, { id: bidding_id, dcr_comment: dcr_comment });

    console.log("deleteInBiddingRequest: ", res.data);

    if (res.data.success) {
      setLoading(false)
      return true;
    } else {
      Toastr({ message: res.data.message });
      setLoading(false)
      return false
    }
  } catch (err) {
    console.log('deleteInBiddingRequest: ', err);
    Toastr({ message: t("An error occurred!") });
    setLoading(false)
    return false
  }
}

export const awardRequest = async (id) => {
  try {
    if (id == null) {
      Toastr({ message: t("Invalid Request!"), type: 'warning' })
      return;
    }

    setLoading(true);
    const res = await axios.post(kuAwardRequest, { id: id });
    console.log('awardRequest: ', res.data);

    if (res.data.success) {
      Toastr({ message: res.data.message, type: 'success' });
      setLoading(false);
      return true;
    } else {
      Toastr({ message: res.data.message })
      setLoading(false);
      return false;
    }

  } catch (err) {
    console.log('awardRequest: ', err);
    Toastr({ message: t("An error occurred!") });
    setLoading(false);
    return false;
  }
}

export const acknowledgeRequest = async (request_id, acknowledgement_message) => {
  if (request_id === null) {
    Toastr({ message: t("Invalid Request!"), type: 'warning' });
    return;
  }

  setLoading(true)

  try {
    const res = await axios.post(kuRequestAcknowledge, { id: request_id, acknowledge: acknowledgement_message });

    console.log("acknowledgeRequest: ", res.data);

    if (res.data.success) {
      setLoading(false);
      Toastr({ message: res.data.message, type: 'success' });
      return true;
    } else {
      Toastr({ message: res.data.message })
      setLoading(false)
      return false
    }
  } catch (err) {
    console.log('acknowledgeRequest: ', err);
    Toastr({ message: t("An error occurred!") });
    setLoading(false)
    return false
  }
}

export const writeReview = async (id, company_user_id, rate, review) => {

  try {
    if (id == null) {
      Toastr({ message: t("Invalid Request!"), type: 'warning' });
      return;
    }
    if (company_user_id === null) {
      Toastr({ message: "Invalid Company!", type: 'warning' });
      return;
    }

    setLoading(true);
    const res = await axios.post(kuWriteReview, {
      "company_user_id": company_user_id,
      "request_id": id,
      "review": review,
      "rating": rate
    })

    console.log('writeReview: ', res.data);

    if (res.data.success) {
      Toastr({ message: res.data.message, type: 'success' });
      setLoading(false);
      return true;
    } else {
      Toastr({ message: res.data.message })
      setLoading(false);
      return false;
    }
  } catch (err) {
    console.log('writeReview err: ', err);
    Toastr({ message: 'An error occurred!' });
    setLoading(false);
    return false;
  }
}

export const getFastCalculationData = async (request_id) => {
  if (!request_id) {
    Toastr({ message: t("Invalid Request!"), type: 'warning' });
    return;
  }

  try {
    const { setFastCalculationData } = useRequestStore.getState();
    setLoading(true);
    const res = await axios.get(kuFastCalculation + `?req_id=${request_id}`);
    console.log("getFastCalculationData:", res.data);
    if (res.data.success) {
      setFastCalculationData(res.data.data);
    } else {
      Toastr({ message: res?.data?.data })
    }
    setLoading(false);
  } catch (err) {
    console.log(err);
    Toastr({ message: t("An error occurred!") });
    setLoading(false);
  }
}

export const getAdvanceCalculationData = async (request_id, shift_id) => {
  console.log('getAdvanceCalculationData: ', request_id, shift_id);
  if (!request_id) {
    Toastr({ message: t("Invalid Request!"), type: 'warning' });
    return;
  } else if (!shift_id) {
    Toastr({ message: t("Invalid Shift!"), type: 'warning' });
    return;
  }

  try {
    const { setAdvanceCalculationData } = useRequestStore.getState();
    setLoading(true);
    const res = await axios.get(kuAdvanceCalculation + `?req_id=${request_id}&shift_id=${shift_id}`);
    console.log("getAdvanceCalculationData:", res.data);
    if (res.data.success) {
      setAdvanceCalculationData(res.data.data);
    } else {
      Toastr({ message: res.data.message });
    }
    setLoading(false);
  } catch (err) {
    console.log(err);
    Toastr({ message: t("An error occurred!") });
    setLoading(false);
  }
}

export const assignNotPlannedRequestShift = async (request_id, shift_id) => {
  if (request_id === null) {
    Toastr({ message: t("Invalid Request!"), type: 'warning' });
    return;
  }

  if (shift_id === null) {
    Toastr({ message: t("Invalid Shift!"), type: 'warning' });
    return;
  }

  setLoading(true)

  try {
    console.log('assignNotPlannedRequestShift stops: ', useRequestStore.getState().not_planned_stops);
    const res = await axios.post(kuNotPlannedShiftAssign, { id: request_id, shift_id: shift_id, stops: useRequestStore.getState().not_planned_stops });

    console.log("assignNotPlannedRequestShift: ", res.data);

    if (res.data.success) {
      setLoading(false)
      Toastr({ message: res.data.message, type: 'success' });
      return true;
    } else {
      Toastr({ message: res.data.message });
      setLoading(false)
      return false
    }
  } catch (err) {
    console.log('assignNotPlannedRequestShift: ', err);
    Toastr({ message: t("An error occurred!") });
    setLoading(false)
    return false
  }
}


//! helpers functions
export const searchRequests = (key) => {
  let x = useRequestStore.getState()?.temp_current_requests?.filter(item => {
    if (item?.title?.toLowerCase()?.includes(key?.toLowerCase())) return item
    return null
  })
  return x;
}

export const changeRequestListPageTitle = () => {
  const { requests_path } = useRequestStore.getState();

  if (requests_path === k_request_paths.saved) {
    return k_request_types.saved;
  } else if (requests_path === k_request_paths.invitation) {
    return k_request_types.invitation;
  } else if (requests_path === k_request_paths.in_bidding) {
    return k_request_types.in_bidding;
  } else if (requests_path === k_request_paths.awarded) {
    return k_request_types.awarded;
  } else if (requests_path === k_request_paths.not_planned) {
    return k_request_types.not_planned;
  } else if (requests_path === k_request_paths.ongoing) {
    return k_request_types.ongoing;
  } else if (requests_path === k_request_paths.completed) {
    return k_request_types.completed;
  } else if (requests_path === k_request_paths.history) {
    return k_request_types.history;
  }
}


export const changeRequestItemIcon = () => {
  const { requests_path } = useRequestStore.getState();

  if (requests_path === k_request_paths.saved) {
    return iSavedReq;
  } else if (requests_path === k_request_paths.invitation) {
    return iInvitationNormal;
  } else if (requests_path === k_request_paths.in_bidding) {
    return iBiddingNormal;
  } else if (requests_path === k_request_paths.awarded) {
    return iAwardedNormal;
  } else if (requests_path === k_request_paths.not_planned) {
    return iNotPlannedNormal;
  } else if (requests_path === k_request_paths.ongoing) {
    return iOnGoingNormal;
  } else if (requests_path === k_request_paths.completed) {
    return iCompletedNormal;
  } else if (requests_path === k_request_paths.history) {
    return iHistoryNormal;
  }
}

export const changeSelectedRequestItemIcon = () => {
  const { requests_path } = useRequestStore.getState();

  if (requests_path === k_request_paths.saved) {
    return iSavedReqSelected;
  } else if (requests_path === k_request_paths.invitation) {
    return iInvitationNormal;
  } else if (requests_path === k_request_paths.in_bidding) {
    return iBiddingNormal;
  } else if (requests_path === k_request_paths.awarded) {
    return iAwardedNormal;
  } else if (requests_path === k_request_paths.not_planned) {
    return iNotPlannedNormal;
  } else if (requests_path === k_request_paths.ongoing) {
    return iOnGoingNormal;
  } else if (requests_path === k_request_paths.completed) {
    return iCompletedNormal;
  } else if (requests_path === k_request_paths.history) {
    return iHistorySelected;
  }
}

export const changeRequestSubtitleOne = (data) => {
  const { requests_path } = useRequestStore.getState();

  if (requests_path === k_request_paths.saved) {
    return 'Saved in ' + (data?.status === 'init' ? 'pickup' : data?.status);
  } else if (requests_path === k_request_paths.invitation || requests_path === k_request_paths.in_bidding || requests_path === k_request_paths.not_planned || requests_path === k_request_paths.awarded) {
    return `${data?.stops_count ?? 0} ${(data?.stops_count ?? 0) > 1 ? 'stops' : 'stop'} (${data?.products_count ?? 0} ${(data?.products_count ?? 0) > 1 ? 'packages' : 'package'})`;
  } else if (requests_path === k_request_paths.ongoing || requests_path === k_request_paths.completed || requests_path === k_request_paths.history) {
    return `${data?.stops_complete_count ?? 0}/${data?.stops_count ?? 0} ${(data?.stops_complete_count ?? 0) > 1 ? 'stops' : 'stop'} completed`;
  }
}

export const changeRequestSubtitleTwo = (data) => {
  const { requests_path } = useRequestStore.getState();

  if (requests_path === k_request_paths.saved) {
    return `Last saved on ${formatDate(data?.last_updated) ?? '--'}`;
  } else if (requests_path === k_request_paths.invitation || requests_path === k_request_paths.in_bidding) {
    const x = checkPastTime(data?.pickup_starts_time, data?.pickup_starts_at);
    if (x) return 'Bidding closed';
    else return `Bid ends on ${formatDate(data?.pickup_starts_at) ?? '--'}, ${formatTime(data?.pickup_starts_time) ?? '--'}`;
  } else if (requests_path === k_request_paths.not_planned || requests_path === k_request_paths.awarded) {
    return `Starts on ${formatDate(data?.pickup_starts_at) ?? '--'}, ${formatTime(data?.pickup_starts_time) ?? '--'}`;
  } else if (requests_path === k_request_paths.ongoing) {
    if (data?.pickup_starts_in_raw <= 0) return 'Will be completed soon'
    else return `Exp. complete on ${formatDate(data?.req_expected_complete_at,) ?? '--'}, ${formatDateOrTime(data?.req_expected_complete_at) ?? '--'}`;
  } else if (requests_path === k_request_paths.completed || requests_path === k_request_paths.history) {
    return `Completed on ${formatDate(data?.last_complete_stop_at) ?? '--'}, ${formatDateOrTime(data?.last_complete_stop_at) ?? '--'}`;
  }
}

export const checkStopsCompletion = (data) => {
  const { requests_path } = useRequestStore.getState();
  if ((requests_path === k_request_paths.completed || requests_path === k_request_paths.history) && (data.stops_count !== data.stops_complete_count)) return true;
  else return false;
}

export const changeRequestItemTopRightInfo = (data) => {
  const { requests_path } = useRequestStore.getState();
  const { user_role } = useGeneralStore.getState();


  if (requests_path === k_request_paths.in_bidding) {
    return user_role === role.customer ? (`DKK ${data?.min_budget?.toLocaleString("da-DK")} - ${data?.min_budget?.toLocaleString("da-DK")}`) : `DKK ${data?.my_bid?.toLocaleString("da-DK")}`;
  } else if (requests_path === k_request_paths.not_planned || requests_path === k_request_paths.awarded) {
    return `DKK ${data?.awarded_bidding?.budget?.toLocaleString("da-DK")}`;
  } else if (requests_path === k_request_paths.history && user_role === role.customer) {
    return data?.rate ? <RatingFiveStar rating={data?.rate} /> : '';
  }
  else return null;
}

export const changeRequestItemTopRightComponent = (data) => {
  const { requests_path } = useRequestStore.getState();
  const { user_role } = useGeneralStore.getState();


  if (requests_path === k_request_paths.history && user_role === role.customer) {
    return 'accent';
  }
  else return null;
}

export const goToRequestDetails = (id, navigateTo) => {
  const { requests_path } = useRequestStore.getState();
  navigateTo(`${requests_path}/details/${id}`);
}

export const defineDataSet = (type) => {
  const { user_role } = useGeneralStore.getState();
  if (type === 'saved') return user_role === role.customer ? ['invitations'] : ['invitations', 'shift_plan', 'my_bid',];
  else if (type === 'invitation') return user_role === role.customer ? ['biddings', 'invitations'] : ['biddings', 'invitations', 'shift_plan', 'my_bid'];
  else if (type === 'in-bidding') return ['biddings', 'invitations', 'shift_plan', 'my_bid'];
  else if (type === 'not-planned' || type === 'awarded' || type === 'on-going') return user_role === role.customer ? ['awarded'] : ['awarded', 'shift_plan', 'my_bid'];
  else if (type === 'completed' || type === 'history') return user_role === role.customer ? ['awarded', 'history', 'complete'] : ['awarded', 'history', 'complete', 'shift_plan', 'my_bid'];
  else return ['invitations', 'biddings', 'awarded', 'history', 'complete', 'shift_plan', 'my_bid'];
}

export const generateSummaryContent = (data, type) => {
  return [
    { title: 'Status', description: checkRequestStatus(type) },
    { title: 'Title', description: data?.title },
    { title: 'Transportation Type', description: data?.transport_type },
    { title: 'Pickup Date', description: formatDate(data?.pickup_date) ?? '--' },
    { title: (type === 'on-going' || type === 'history') ? 'Picked Up Time' : 'Pickup Time', description: (formatTime(data?.pickup_start_time) ?? '--') + ' - ' + (formatTime(data?.pickup_end_time) ?? '--') },
    { title: 'Delivery Overview', description: `${data?.stops?.length ?? 0} ${(data?.stops?.length ?? 0) > 1 ? 'stops' : 'stop'} (${data?.products?.length ?? 0} ${(data?.products?.length ?? 0) > 1 ? 'packages' : 'package'})` },
  ];
}

export const generateSummaryContent2 = (data, type) => {
  const { user_role } = useGeneralStore.getState();

  if (user_role === role.customer) {
    if (type === 'in-bidding') {
      return [
        { title: 'Direct Invite', description: data?.invitation_data?.length + ' Companies' },
        { title: 'Global Invite', description: data?.is_global ? `Submitted` : 'Not Submitted' },
      ];
    } else if (type === 'awarded' || type === 'on-going') {
      return [
        { title: 'Awarded Company', description: data?.awarded_company?.name, className: '', onClick: () => { } },
        { title: 'Agreed Budget', description: 'DKK ' + data?.awarded?.budget?.toLocaleString("da-DK") },
      ];
    }
  } else {
    if (type === 'invitation' || type === 'in-bidding') {
      return [
        { title: 'Customer Name', description: data?.user?.name },
      ];
    } else if (type === 'not-planned') {
      return [
        { title: (data?.stops?.length ?? 0) > 1 ? 'Stop References' : 'Stop Reference', description: data?.stops?.length ?? 0 },
        { title: (data?.products?.length ?? 0) > 1 ? 'Products' : 'Product', description: data?.products?.length ?? 0 },
      ];
    } else if (type === 'awarded' || type === 'on-going') {
      return [
        { title: 'Agreed Budget', description: 'DKK ' + data?.my_bid?.budget?.toLocaleString("da-DK") },
      ];
    } else if (type === 'completed' || type === 'history') {
      return [
        { title: 'Customer Name', description: data?.user?.name },
        { title: 'Agreed Budget', description: 'DKK ' + data?.my_bid?.budget?.toLocaleString("da-DK") },
      ];
    }
  }
}

export const generateSummaryContent3 = (data, type) => {
  const { user_role } = useGeneralStore.getState();

  if (user_role === role.customer) {
    if (type === 'on-going') {
      return [
        { title: 'Completed Stops', description: `${checkStopsAndProductCompletion(data?.stops)?.stops} ${checkStopsAndProductCompletion(data?.stops)?.stops > 1 ? 'stops' : 'stop'} (${checkStopsAndProductCompletion(data?.stops)?.products} ${checkStopsAndProductCompletion(data?.stops)?.products > 1 ? 'packages' : 'package'})`, className: `${type === 'history' && (checkStopsAndProductCompletion(data?.stops)?.stops !== data?.stops?.length) ? 'text-cRed' : ''}` },
        { title: 'Started', description: (formatDate(data?.ongoing_info?.req_start_date) ?? '--') + ', ' + (formatTime(data?.ongoing_info?.req_start_time) ?? '--') },
        { title: 'Expected End', description: (formatDate(data?.ongoing_info?.req_expected_date) ?? '--') + ', ' + (formatTime(data?.ongoing_info?.req_expected_time) ?? '--') },
      ];
    } else if (type === 'history') {
      return [
        { title: 'Completed Stops', description: `${checkStopsAndProductCompletion(data?.stops)?.stops} ${checkStopsAndProductCompletion(data?.stops)?.stops > 1 ? 'stops' : 'stop'} (${checkStopsAndProductCompletion(data?.stops)?.products} ${checkStopsAndProductCompletion(data?.stops)?.products > 1 ? 'packages' : 'package'})`, className: `${type === 'history' && (checkStopsAndProductCompletion(data?.stops)?.stops !== data?.stops?.length) ? 'text-cRed' : ''}` },
        { title: 'Started', description: (formatDate(data?.complete_info?.req_start_date) ?? '--') + ', ' + (formatTime(data?.complete_info?.req_start_time) ?? '--') },
        { title: 'End', description: (formatDate(data?.complete_info?.req_complete_date) ?? '--') + ', ' + (formatTime(data?.complete_info?.req_complete_time) ?? '--') },
      ];
    }
  } else {
    if (type === 'not-planned') {
      return [
        { title: 'Customer Name', description: data?.user?.name },
      ];
    } else if (type === 'awarded' || type === 'on-going' || type === 'completed' || type === 'history') {
      return [
        { title: 'Driver Name', description: data?.driver?.name ?? 'NA' },
        { title: 'Vehicle Number', description: data?.car_license_number ?? 'NA' },
      ];
    }
  }
}

export const generateSummaryContent4 = (data, type) => {
  const { user_role } = useGeneralStore.getState();

  if (user_role === role.company) {
    console.log('count', checkStopsAndProductCompletion(data?.stops)?.stops);
    if (type === 'on-going') {
      return [
        { title: 'Completed Stops', description: `${checkStopsAndProductCompletion(data?.stops)?.stops} ${checkStopsAndProductCompletion(data?.stops)?.stops > 1 ? 'stops' : 'stop'} (${checkStopsAndProductCompletion(data?.stops)?.products} ${checkStopsAndProductCompletion(data?.stops)?.products > 1 ? 'packages' : 'package'})`, className: `${(type === 'completed' || type === 'history') && (checkStopsAndProductCompletion(data?.stops)?.stops !== data?.stops?.length) ? 'text-cRed' : ''}` },
        { title: 'Started', description: (formatDate(data?.ongoing_info?.req_start_date) ?? '--') + ', ' + (formatTime(data?.ongoing_info?.req_start_time) ?? '--') },
        { title: 'Expected End', description: (formatDate(data?.ongoing_info?.req_expected_date) ?? '--') + ', ' + (formatTime(data?.ongoing_info?.req_expected_time) ?? '--') },
      ];
    } else if (type === 'completed' || type === 'history') {
      return [
        { title: 'Completed Stops', description: `${checkStopsAndProductCompletion(data?.stops)?.stops} ${checkStopsAndProductCompletion(data?.stops)?.stops > 1 ? 'stops' : 'stop'} (${checkStopsAndProductCompletion(data?.stops)?.products} ${checkStopsAndProductCompletion(data?.stops)?.products > 1 ? 'packages' : 'package'})`, className: `${(type === 'completed' || type === 'history') && (checkStopsAndProductCompletion(data?.stops)?.stops !== data?.stops?.length) ? 'text-cRed' : ''}` },
        { title: 'Started', description: (formatDate(data?.complete_info?.req_start_date) ?? '--') + ', ' + (formatTime(data?.complete_info?.req_start_time) ?? '--') },
        { title: 'End', description: (formatDate(data?.complete_info?.req_complete_date) ?? '--') + ', ' + (formatTime(data?.complete_info?.req_complete_time) ?? '--') },
      ];
    }
  }
}

export const checkRequestStatus = (data) => {
  switch (data) {
    case 'saved':
      return 'Saved';
    case 'invitation':
      return 'Invitation';
    case 'in-bidding':
      return 'In Bidding';
    case 'in_bidding':
      return 'In Bidding';
    case 'not-planned':
      return 'Not Planned';
    case 'awarded':
      return 'Awarded';
    case 'on-going':
      return 'Ongoing';
    case 'on_going':
      return 'Ongoing';
    case 'ongoing':
      return 'Ongoing';
    case 'completed':
      return 'Completed';
    case 'history':
      return 'History';

    default:
      break;
  }
}

export const checkStopsAndProductCompletion = (data) => {
  let x = { stops: 0, products: 0 };
  data?.forEach((stop) => {
    if (stop?.status === "delivered") x.stops++;
    x.products += stop?.products?.length;
  });
  return x;
}

export const checkIsShowPickupOrDeliveryStatus = (status, type) => {
  // console.log('type, status', type, status);
  if ((type === 'on-going' || type === 'history' || type === 'completed')) return true;
  else return false;
}

export const definePickupAndDeliveryStatus = (data, type) => {
  if (type === 'pickup') {
    if (data?.pickup_status === 'delivered' || data?.pickup_status === "not_delivered")
      return `${data?.pickup_status === 'not_delivered' ? 'Not' : ''} Picked up: ${formatDate(data?.pickup_driver_complete_date)}, ${formatTime(data?.pickup_driver_complete_time)}`;
    else
      return `Exp. Pickup: ${formatDate(data?.pickup_expected_date)}, ${formatTime(data?.pickup_expected_time)}`;
  } else {
    if (data?.status === 'delivered' || data?.status === "not_delivered")
      return `${data?.status === 'not_delivered' ? 'Not' : ''} Delivered: ${formatDate(data?.delivery_driver_complete_date)}, ${formatTime(data?.delivery_driver_complete_time)}`;
    else
      return `Exp. Delivery: ${formatDate(data?.delivery_expected_date)}, ${formatTime(data?.delivery_expected_time)}`;
  }
}

export const checkIsShowDeliveryOverview = (stop, type) => {
  if ((stop?.driver_comment || stop?.driver_attachment || stop?.driver_signature) && (type === 'on-going' || type === 'completed' || type === 'history')) return true;
  else return false;
}

export const checkIsCustomerProfileShow = (type) => {
  const { user_role } = useGeneralStore.getState();
  if (user_role === role.company && (type === 'not-planned' || type === 'awarded' || type === 'on-going' || type === 'completed' || type === 'history')) return true;
  else return false;
}

export const checkIsBiddingDetailsShow = (type) => {
  const { user_role } = useGeneralStore.getState();
  if (user_role === role.customer && (type === 'awarded' || type === 'on-going' || type === 'history')) return true;
  else return false;
}

export const defineIsDangerStatus = (item, path) => {
  const { user_role } = useGeneralStore.getState();
  // if ((path === k_request_paths.not_planned || path === k_request_paths.awarded) && (item?.awarded_status === k_arcd_status.company_reject || item?.awarded_status === k_arcd_status.company_reject)) return true;
  if ((path === k_request_paths.in_bidding || path === '/') && user_role === role.customer && item?.status === "in_bidding_red") return true;
  else return false;
}

export const defineAccentType = (item, path) => {
  const { user_role } = useGeneralStore.getState();
  // if ((path === k_request_paths.not_planned || path === k_request_paths.awarded) && (item?.awarded_status === k_arcd_status.company_reject || item?.awarded_status === k_arcd_status.company_reject)) return 'danger-red';
  if ((path === k_request_paths.in_bidding || path === '/') && user_role === role.customer && item?.status === "in_bidding_red") return 'danger-red';
  else return null;
}

export const checkIsSubtitleOneRed = (item, path) => {
  if (path === k_request_paths.completed || path === k_request_paths.history) {
    if (item?.stops_complete_count !== item?.stops_count) return true;
    else return false;
  }
}

export const setRequestDetailsPageTitle = (type) => {
  if (type === 'in-bidding') return 'In Bidding';
  else if (type === 'not-planned') return 'Not Planned';
  else if (type === 'on-going') return 'On Going';
  else return type;
}

export const defineNotPlannedDeliveryDate = (pickup_date, delivery_time, pickup_time) => {

  if (!delivery_time || delivery_time === '') return formatDate(pickup_date);
  else {
    if (pickup_time > delivery_time) return formatDate(new Date(pickup_date).setDate(new Date(pickup_date).getDate() + 1));
    else return formatDate(pickup_date);
  };
}