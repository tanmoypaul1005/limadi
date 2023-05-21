/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import useGeneralStore from '../../../../app/stores/others/generalStore';
import useRequestStore, { getRequests, changeRequestSubtitleOne, changeRequestSubtitleTwo, changeRequestItemIcon, changeRequestListPageTitle, changeRequestItemTopRightInfo, changeRequestItemTopRightComponent, goToRequestDetails, defineIsDangerStatus, defineAccentType, checkIsSubtitleOneRed, } from '../../../../app/stores/others/requestStore';
import { k_page_titles } from '../../../../app/utility/const';
import { changePageTitle } from '../../../../app/utility/utilityFunctions';
import CommonEmptyData from '../../../../components/emptyData/CommonEmptyData';
import CommonListItem from '../../../../components/listItems/CommonListItem';
import RequestListTitle from './components/RequestListTitle';
import TopSectionContent from './components/TopSectionContent';

const RequestList = () => {
  // const { user_role } = useGeneralStore();
  const navigateTo = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { current_requests, setCurrentRequests, setRequestsSearchKey, setRequestsPath, } = useRequestStore();


  useEffect(() => {
    setRequestsPath(path);
    setCurrentRequests(path);
    setRequestsSearchKey('');
  }, [path]);

  useEffect(() => {
    fetchRequests();
    changePageTitle(k_page_titles.requests);
  }, []);

  const fetchRequests = async () => {
    await getRequests();
    setCurrentRequests(path);
  }

  // const defineCancelRequest = (item) => {
  //   if ((user_role === role.customer) && (item?.awarded_status === k_arcd_status.cancel_req_company)) return true;
  //   else if ((user_role === role.company) && (item?.awarded_status === k_arcd_status.cancel_req_customer || item?.awarded_status === k_arcd_status.delete_req_customer)) return true;
  //   else return false;
  // }

  // const defineCancelRequest2 = (item) => {
  //   if ((user_role === role.company) && (item?.awarded_status === k_arcd_status.cancel_req_company)) return true;
  //   else if ((user_role === role.customer) && (item?.awarded_status === k_arcd_status.cancel_req_customer || item?.awarded_status === k_arcd_status.delete_req_customer)) return true;
  //   else return false;
  // }


  return (
    <div className='w-full'>
      <RequestListTitle
        title={changeRequestListPageTitle()}
        onReload={() => {
          getRequests();
          setRequestsSearchKey('');
        }}
        counter={current_requests?.length ?? 0}
        rightSideComponent={
          <TopSectionContent />
        }
      />

      {current_requests?.length > 0 ?
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 xl:gap-8 2xl:gap-8">
          {
            current_requests?.map((item, index) => (
              <CommonListItem
                key={index}
                title={item?.title ?? 'NA'}
                subTitleOne={changeRequestSubtitleOne(item)}
                subTitleTwo={changeRequestSubtitleTwo(item)}
                subTitleOneRed={checkIsSubtitleOneRed(item, path)}
                iconNormal={changeRequestItemIcon()}
                topRightComponent={changeRequestItemTopRightInfo(item)}
                topRightComponentType={changeRequestItemTopRightComponent(item)}
                onClick={() => { goToRequestDetails(item?.id, navigateTo) }}
                accentType={defineAccentType(item, path)}
                isDanger={defineIsDangerStatus(item, path)}

              // iconSelected={changeSelectedRequestItemIcon()}
              // isCancelRequest={defineCancelRequest(item)}
              // isCancelRequest2={defineCancelRequest2(item)}
              // selected={item?.id === request_details?.id}
              />
            ))
          }
        </div>
        : <CommonEmptyData title='Requests Not Available!' details='You have no requests available to show!' />
      }
    </div>
  )
}

export default RequestList


