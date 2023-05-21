/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useRequestStore, { submitOrUpdateRequestInvitationBidding } from '../../../../../../../app/stores/others/requestStore';
import CommonButton from '../../../../../../../components/button/CommonButton';
import CommonButtonOutlined from '../../../../../../../components/button/CommonButtonOutlined';
import CommonInput from '../../../../../../../components/input/CommonInput';
import ShiftDetailsAndPlanModal from '../../../../../../../components/modal/shiftDetailsAndPlanModal.jsx/ShiftDetailsAndPlanModal';
import DeclineInvitationConfirmModal from './modals/DeclineInvitationConfirmModal';

export default function PlaceBid() {
  const { place_bid_form, setPlaceBidForm, request_details, resetPlaceBidForm } = useRequestStore();
  const [globalReqMode, setGlobalReqMode] = useState(false);

  const params = useParams();
  const { request_id } = params;
  const navigateTo = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    if (globalReqMode)
      submitOrUpdateRequestInvitationBidding('submit', request_id, navigateTo, '/global-request');
    else
      submitOrUpdateRequestInvitationBidding('submit', request_id, navigateTo, '/requests/invitation')
  }
  const [showDeclineInvitationConfirmModal, setShowDeclineInvitationConfirmModal] = useState(false);
  const [show_plan_tool_modal, setShowPlanToolModal] = useState(false);

  const start_time = request_details?.pickup_start_time;
  const start_date = request_details?.pickup_date;

  useEffect(() => {
    resetPlaceBidForm()
  }, [request_details]);

  useEffect(() => {
    if (window.location.pathname === '/global-request/details/' + request_id)
      setGlobalReqMode(true);
    else
      setGlobalReqMode(false);
  }, [window.location.pathname]);

  return (
    <div className='mt-5'>

      <form onSubmit={submitForm}>

        <div className='border border-cMainBlue w-full rounded px-3 pb-6 '>
          <div className='text-fs16 font-fw500 pt-3 mb-2'>Place Bid</div>


          <CommonInput required={true} name={'budget'} value={place_bid_form?.budget} onChange={setPlaceBidForm} labelText='Budget' className={'mb-2 mt-0'} type={'number'} max_input={8} />
          <CommonInput required={true} className={'mt-0'} name={'description'} value={place_bid_form?.description} onChange={setPlaceBidForm} labelText='Description' textarea={true} type={'text'} max_input={255} />

        </div>

        <div className={`flex ${globalReqMode ? "flex-row-reverse" : " flex-row"} justify-between items-center space-x-2 mt-6`}>

          {globalReqMode ? "" :
            <CommonButtonOutlined btnLabel={'Plan Tool'} onClick={() => setShowPlanToolModal(true)} />
          }
          <CommonButton btnLabel={globalReqMode ? 'Place Bid' : 'Accept'} type={'submit'} />
        </div>

      </form>

      {globalReqMode ? "" : <div onClick={() => setShowDeclineInvitationConfirmModal(true)} className='w-full text-center text-cRed text-fs16 font-fw500 cp mt-6'>Decline Invitation</div>}

      <DeclineInvitationConfirmModal showModal={showDeclineInvitationConfirmModal} setShowModal={setShowDeclineInvitationConfirmModal} request_id={request_id} />

      {
        (start_time && start_date) && <ShiftDetailsAndPlanModal
          title='Plan Tool'
          showModal={show_plan_tool_modal}
          setShowModal={setShowPlanToolModal}
          start_time={start_time}
          start_date={start_date}
        />
      }

    </div>
  )
}
