import React, { useState } from 'react'
import useRequestStore from '../../../../../../../app/stores/others/requestStore'
import { base_url_src } from '../../../../../../../app/utility/const';
import { iFavCompanyWhite, iFavoriteIcon } from '../../../../../../../app/utility/imageImports';
import CommonListItem from '../../../../../../../components/listItems/CommonListItem'
import CompanyDetailsModal from '../../../../../../../components/modal/CompanyDetailsModal';
import RatingFiveStar from '../../../../../../../components/rating/RatingFiveStar';

export default function BiddingCompanies() {
  const { request_details } = useRequestStore();
  const [showModal, setShowModal] = useState(false);
  const [company_id, setCompanyId] = useState(null);
  const [bidding_info, setBiddingInfo] = useState(null);

  return (
    <>

      <div className='mt-5'>
        <div className='sub-title'>Bidding Companies ({request_details?.biddings?.length})</div>

        <div className='mt-4 flex flex-col justify-start w-full space-y-4'>

          {
            // todo:: cancel status check, bg color change, and for cancel status, user can't re-awarded request
            request_details?.biddings?.map((item, index) => (
              <div className='relative'>
                <CommonListItem
                  key={index}
                  title={item?.company_info?.name}
                  subTitleOne={item?.is_from_invite ? 'From Invite' : 'From Global'}
                  subTitleTwo={<RatingFiveStar rating={Math.round(item?.company_info?.rate)} />}
                  topRightComponent={'DKK ' + item?.budget.toLocaleString("da-DK")}
                  selected={item?.status === 'init' ? true : false}
                  className={' hover:border-cBrand h-s90 hover:bg-cBrand'}
                  borderColor={'#F89818'}
                  iconSelected={item?.company_info?.image ? (base_url_src + item?.company_info?.image) : iFavCompanyWhite}
                  iconNormal={item?.company_info?.image ? (base_url_src + item?.company_info?.image) : iFavCompanyWhite}
                  imgCover={true}
                  onClick={() => {
                    setShowModal(true);
                    setCompanyId(item?.company_info?.id);
                    setBiddingInfo(item);
                  }}
                  accentType={item?.status === 'init' ? '' : 'danger'}

                />

                {item?.company_info?.is_favorite ? <div className="absolute bottom-1 right-1">
                  <img src={iFavoriteIcon} alt="" />
                </div> : <></>}
              </div>
            ))
          }
        </div>

        {company_id && <CompanyDetailsModal showModal={showModal} setShowModal={setShowModal} company_id={company_id} bidding_info={bidding_info} bidding_details={bidding_info?.status === 'init' ? true : false} />}
      </div>
    </>
  )
}
