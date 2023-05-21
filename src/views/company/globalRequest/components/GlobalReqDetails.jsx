import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import useGeneralStore from '../../../../app/stores/others/generalStore';
import useRequestStore, { checkRequestStatus, getRequestDetails } from '../../../../app/stores/others/requestStore';
import { formatDate, formatTime, formatTimeHourMinutes, titleCaseJS } from '../../../../app/utility/utilityFunctions';
import CommonButtonOutlined from '../../../../components/button/CommonButtonOutlined';
import ImageViewer from '../../../../components/image/ImageViewer';
import ShiftDetailsAndPlanModal from '../../../../components/modal/shiftDetailsAndPlanModal.jsx/ShiftDetailsAndPlanModal';
import CommonTopTitleSection from '../../../../components/title/CommonTopTitleSection';
import HrDivider from '../../../../components/utility/HrDivider';
import Summary from '../../../../components/utility/summary/Summary';
import CommonViewComponent from '../../../../components/viewer/CommonViewComponent';
import RequestDetailsTextTitle from '../../../common/requests/requestDetails/components/mainContents/components/RequestDetailsTextTitle';
import PlaceBid from '../../../common/requests/requestDetails/components/summary/components/PlaceBid';

const GlobalReqDetails = () => {
    // const { isSidebarOpen } = useLayoutStore();
    const { setShowShiftDetailsAndPlanModal } = useGeneralStore();
    const [show_plan_tool_modal, setShowPlanToolModal] = useState(false);
    const { request_details } = useRequestStore();

    const { request_id } = useParams();

    const requestSummaryContents = [
        {
            title: 'Status',
            description: checkRequestStatus(request_details?.status) ?? "NA",
        },
        {
            title: 'Title',
            description: titleCaseJS(request_details?.title) ?? "NA",
        },
        {
            title: 'Transportation Type',
            description: titleCaseJS(request_details?.transport_type) ?? "NA",
        },
        {
            title: 'Pickup Date',
            description: formatDate(request_details?.pickup_date) ?? "NA",
        },
        {
            title: (request_details?.status === 'on-going' || request_details?.status === 'history') ? 'Picked Up Time' : 'Pickup Time',
            description: (formatTime(request_details?.pickup_start_time) ?? "NA") + ' - ' + (formatTime(request_details?.pickup_end_time) ?? "NA"),
        },
        {
            title: 'Delivery Overview',
            description: `${request_details?.stops?.length ?? 0} ${request_details?.stops?.length > 1 ? 'Stops':'Stop'} ( ${request_details?.products?.length ?? 0} ${request_details?.products?.length>1? 'Packages':'Package'} )`,
        },
    ]

    useEffect(() => {
        console.log('request_id', request_id);
        getRequestDetails("invitation", request_id);
    }, [request_id]);
    return (
        <div
            onClick={() => console.log('request_details: ', request_details)}
        >

            {/* top title bar */}
            <CommonTopTitleSection
                withBackLink='/global-request'
                title='Global Request Details'

                rightSideComponent={
                    <div className='flex items-center space-x-2.5' >
                        <CommonButtonOutlined onClick={() => setShowPlanToolModal(true)} btnLabel='Available Shifts' width='w-[150px]' />
                    </div>
                }
            />

            {/*v         right side section */}
            <div className='w-[355px] absolute right-0 top-[150px] mr-8'>
                <Summary content={requestSummaryContents} />
                {/* <div className="w-full py-2.5"><hr /></div> */}
                {/* <BiddingOverview /> */}
                <PlaceBid />
                {/* <div className="flex flex-row-reverse pt-5">
                    <CommonButton width='w-[120px]' btnLabel='place bid' />
                </div> */}
            </div>


            {/*b         main content (left) */}
            <div className='space-y-5 w-[calc(100%-380px)]'>
                <RequestDetailsTextTitle title='pickup overview' />

                <CommonViewComponent labelText='title' value={request_details?.pickup_title ?? "NA"} />

                <CommonViewComponent labelText='type of transportation' value={request_details?.transport_type ?? "NA"} />
                <CommonViewComponent labelText='pickup address' value={request_details?.pickup_address ?? "NA"} />
                {/* <div className="flex items-center justify-between space-x-5">
                </div> */}

                <div className="flex items-center space-x-5">
                    <CommonViewComponent labelText='pickup date' value={request_details?.pickup_date ? formatDate(request_details?.pickup_date) : "NA"} />
                    <CommonViewComponent labelText='pickup time' value={formatTimeHourMinutes(request_details?.pickup_expected_time)} />
                </div>

                <CommonViewComponent
                    labelText='comment'
                    value={request_details?.pickup_comment ?? "NA"}
                />

                {request_details?.pickup_attachment &&
                    <ImageViewer src={request_details?.pickup_attachment} label={'Attachment'}
                    />}

            </div>
            {request_details?.stops?.length > 0 ?
                <div div className="w-[calc(100%-380px)]">
                    <HrDivider />
                </div>
                : ""}
            {
                request_details?.stops?.length > 0 ? request_details?.stops?.map((stop, index) => (

                    <div key={index} className='pt-5' >

                        {/* 2nd main content */}
                        <div className='space-y-5 w-[calc(100%-380px)]'>
                            <RequestDetailsTextTitle title={'delivery ' + (index + 1)} />

                            <CommonViewComponent labelText='delivery address' value={stop?.address ?? "NA"} />
                            {/* <CommonViewComponent labelText='Delivery date' value={formatDate(stop?.date)} />
                            <CommonViewComponent labelText='Delivery time' value={formatTime(stop?.start_time)} /> */}

                            {/* list of products */}
                            {stop?.products?.length > 0 ? stop?.products?.map((product, index) => (

                                <CommonViewComponent key={index} labelText='Product' value={product?.text ?? "NA"} />
                            ))
                                : ""
                            }

                            <CommonViewComponent
                                labelText='comment'
                                value={stop?.comment ?? "NA"}
                            />

                            {stop?.attachment ?
                                <ImageViewer src={stop?.attachment} label={'Attachment'} />
                                : ""
                            }
                        </div>

                    </div>
                ))
                    : ""
            }
            {
                request_details?.pickup_start_time && request_details?.pickup_date ?

                    <ShiftDetailsAndPlanModal
                        title=' '
                        showModal={show_plan_tool_modal}
                        setShowModal={setShowPlanToolModal}
                        start_time={request_details?.pickup_start_time}
                        start_date={request_details?.pickup_date}
                    />
                    : ""
            }
        </div >
    )
}

export default GlobalReqDetails