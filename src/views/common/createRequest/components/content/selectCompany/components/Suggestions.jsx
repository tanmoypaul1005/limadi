import React from 'react'
import useCreateRequestStore from '../../../../../../../app/stores/others/createRequestStore';
import { iFavCompanyGray } from '../../../../../../../app/utility/imageImports';
import CommonEmptyData from '../../../../../../../components/emptyData/CommonEmptyData';
import CompanyListItem from '../../../../../../../components/listItems/CompanyListItem'
import CompanyDetailsModal from '../../../../../../../components/modal/CompanyDetailsModal';

export default function Suggestions({ companies }) {

  const { setSelectedCompanies, selected_companies } = useCreateRequestStore();
  const [showModal, setShowModal] = React.useState(false);
  const [company_id, setCompanyId] = React.useState(null);


  return (
    <div className='my-3'>
      <div className='text-fs16 font-fw500 mb-2'>Available Companies({companies?.length})</div>

      {companies?.length > 0 ?
        <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-4 xl:grid-cols-2 2xl:grid-cols-3 gap-y-4'>

          {
            companies?.map((company, index) => (
              <CompanyListItem
                key={index}
                title={company?.name}
                rating={Math.round(company?.rate)}
                image={company?.image}
                dummyImage={iFavCompanyGray}
                is_favorite={company?.is_fav}
                has_action_btn={true}
                is_add_type={true}
                onActionBtnClick={() => {
                  let x = selected_companies;
                  x.push(company);
                  setSelectedCompanies(x);

                }}
                onClick={() => {
                  console.log('company', company);
                  setCompanyId(company?.id);
                  setShowModal(true);
                }}
              />
            ))
          }


        </div>
        :
        <CommonEmptyData title='No Company Available' details='' />
      }

      <CompanyDetailsModal showModal={showModal} setShowModal={setShowModal} company_id={company_id} bidding_details={false} />
    </div>
  )
}
