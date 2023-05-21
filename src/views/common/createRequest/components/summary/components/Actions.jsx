import React from 'react'
import useCreateRequestStore, { saveRequest } from '../../../../../../app/stores/others/createRequestStore';
import useGeneralStore from '../../../../../../app/stores/others/generalStore';
import { create_request_steps, create_request_type, k_cr_actions, user_role as role } from '../../../../../../app/utility/const';
import { Toastr } from '../../../../../../app/utility/utilityFunctions';
import CommonButton from '../../../../../../components/button/CommonButton';
import CommonButtonOutlined from '../../../../../../components/button/CommonButtonOutlined';

export default function Actions() {

  const { request_type, current_step, setCurrentSetup, setShowRequestConfirmModal, cr_form } = useCreateRequestStore();
  const { user_role } = useGeneralStore();

  const actionNext = async () => {
    if (request_type === create_request_type.normal && current_step === create_request_steps.pickup) {
      if (user_role === role.customer) {
        const res = await saveRequest(k_cr_actions.next);
        res && setCurrentSetup(create_request_steps.select_company);
      }
      else if (user_role === role.company) {
        const res = await saveRequest(k_cr_actions.next);
        res && setCurrentSetup(create_request_steps.select_shift);
      }
    } else if (request_type === create_request_type.mass_import && current_step === create_request_steps.pickup) {
      setCurrentSetup(create_request_steps.mass_import)
    } else if (request_type === create_request_type.mass_import && current_step === create_request_steps.mass_import) {
      user_role === role.customer ? setCurrentSetup(create_request_steps.select_company) : setCurrentSetup(create_request_steps.select_shift);
    }
  }

  const actionBack = async () => {
    if (request_type === create_request_type.normal && current_step === create_request_steps.select_company) {
      const res = await saveRequest(k_cr_actions.back);
      res && setCurrentSetup(create_request_steps.pickup)
    } else if (request_type === create_request_type.mass_import && current_step === create_request_steps.select_company) {
      setCurrentSetup(create_request_steps.mass_import)
    } else if (request_type === create_request_type.mass_import && current_step === create_request_steps.mass_import) {
      setCurrentSetup(create_request_steps.pickup)
    } else if (request_type === create_request_type.normal && current_step === create_request_steps.select_shift) {
      const res = await saveRequest(k_cr_actions.back);
      res && setCurrentSetup(create_request_steps.pickup);
    } else if (request_type === create_request_type.mass_import && current_step === create_request_steps.select_shift) {
      setCurrentSetup(create_request_steps.mass_import)
    }
  }

  const checkIsSubmitBtnDisable = () => {
    if (user_role === role.company && cr_form?.shift_id && cr_form?.budget && cr_form?.budget !== '' && cr_form?.bid_details && cr_form?.bid_details !== '' && user_role === role.company) {
      return false;
    }

    if (user_role === role.customer && (cr_form?.invitation_ids?.length > 0 || cr_form?.is_global)) return false;

    return true;
  }

  return (

    <div className={`flex flex-row ${current_step === create_request_steps.pickup ? 'justify-end' : 'justify-between'} mt-4`}>
      {current_step !== create_request_steps.pickup && <CommonButtonOutlined btnLabel='Back' onClick={actionBack} />}
      {(current_step === create_request_steps.pickup || current_step === create_request_steps.mass_import) && <CommonButton btnLabel='Next' onClick={actionNext} />}
      {(current_step === create_request_steps.select_company || current_step === create_request_steps.select_shift) &&
        <CommonButton
          btnLabel='Submit'
          isDisabled={checkIsSubmitBtnDisable()}
          onClick={() => {

            if (user_role === role.company && cr_form?.bid_details?.trim().length === 0) {
              Toastr({ message: 'Please enter bidding description', type: 'info' })
              return;
            }

            setShowRequestConfirmModal(true);
            saveRequest(k_cr_actions.save)
          }}
        />
      }
    </div>

  )
}
