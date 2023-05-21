import React from 'react'
import useCreateRequestStore from '../../../../../../app/stores/others/createRequestStore'
import CommonInput from '../../../../../../components/input/CommonInput'

export default function BiddingOverview() {
  const { cr_form, changeCrForm } = useCreateRequestStore();

  return (
    <div className='border border-cMainBlue mt-4 rounded-br4 p-3'>
      <div className='sub-title'>Bidding Overview</div>

      <CommonInput required={true} max_input={8} labelText='Budget' type='number' name={'budget'} value={cr_form?.budget} onChange={(e) => {
        changeCrForm('budget', e.target.value);
        cr_form?.bid_details?.trim();
      }} />
      <CommonInput required={true} textareaWithoutBorderBottom={false} value={cr_form?.bid_details} className='mt-2' rows={3} labelText='Description' textarea={true} name={'bid_details'} onChange={(e) => changeCrForm('bid_details', e.target.value)} />
      <div className="pb-5"></div>

    </div>
  )
}
