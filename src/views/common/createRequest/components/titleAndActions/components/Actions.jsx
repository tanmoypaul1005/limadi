import React from 'react'
import useCreateRequestStore, { clearCrForm, saveRequest } from '../../../../../../app/stores/others/createRequestStore';
import CommonButton from '../../../../../../components/button/CommonButton';
import ActionButton from '../../../../../../components/button/ActionButton';
import { create_request_steps, create_request_type } from '../../../../../../app/utility/const';
import { iMassImport } from '../../../../../../app/utility/imageImports';
import { Toastr } from '../../../../../../app/utility/utilityFunctions';
import { deleteRequest } from '../../../../../../app/stores/others/requestStore';
import { useNavigate } from 'react-router-dom';

export default function Actions() {
  const { request_type, setCreateRequestType, current_step, cr_form, resetCreateRequest, setCurrentSetup } = useCreateRequestStore();
  const navigateTo = useNavigate();

  const actionDataArray = cr_form?.id ? [
    { title: 'Save', action: () => saveRequest() },
    { title: 'Clear', action: () => clearCrForm() },
    {
      title: 'Delete', action: async () => {
        const res = await deleteRequest(cr_form?.id);
        if (res) {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          setCurrentSetup(create_request_steps.pickup);
          setCreateRequestType(create_request_type.normal);
          resetCreateRequest();
          navigateTo('/request/create');
        }
      }
    }
  ] : [
    { title: 'Save', action: () => saveRequest() },
    { title: 'Clear', action: () => clearCrForm() },
  ];

  return (
    <div className='flex flex-row justify-end space-x-3'>
      {
        (current_step === create_request_steps.pickup) &&
        <CommonButton
          btnLabel='Mass Import'
          icon={iMassImport}
          mediumSize={true}
          onClick={() => {
            Toastr({ message: 'Coming Soon', type: 'info' });
            // (request_type === create_request_type.normal) && setCreateRequestType(create_request_type.mass_import);
            // (request_type === create_request_type.mass_import) && setCreateRequestType(create_request_type.normal);

          }}
          colorType={(request_type === create_request_type.normal && current_step === create_request_steps.pickup) ? 'primary' : 'basic'}
        />
      }

      <ActionButton
        width='w-[100px]'
        label='Actions'
        dataArray={actionDataArray}
      />
    </div>
  )
}
