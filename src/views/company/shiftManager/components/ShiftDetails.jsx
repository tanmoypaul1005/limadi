import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useShiftStore, { getShiftDetails } from '../../../../app/stores/company/shiftStore'
import { formatDate, formatTimeHourMinutes, insertElementAtIndex } from '../../../../app/utility/utilityFunctions'
import CommonButton from '../../../../components/button/CommonButton'
import CommonButtonOutlined from '../../../../components/button/CommonButtonOutlined'
import CommonStopsList from '../../../../components/listItems/CommonStopsList'
import CommonTopTitleSection from '../../../../components/title/CommonTopTitleSection'
import SecondaryTitle from '../../../../components/title/SecondaryTitle'
import Summary from '../../../../components/utility/summary/Summary'
import ShiftDetailsTable from './ShiftDetailsTable'
import ShiftLogBookTable from './ShiftLogBookTable'
import ShiftOverView from './ShiftOverView'

const ShiftDetails = () => {
    const {
        shiftDetailsData,
        setShowEditShiftModal,
        setShowDeleteShiftModal,
        shiftRouteList,
    } = useShiftStore();

    const [summaryData, setSummaryData] = useState([]);

    const { shift_id } = useParams();

    const refreshCarAndDrivers = async () => {
        await getShiftDetails(shift_id);
    }

    useEffect(() => {
        window.scrollTo(0, 0);

        refreshCarAndDrivers();

        // setSummaryData();
    }, [shift_id]);

    useEffect(() => {
        setSummaryData()
        if (shiftDetailsData?.is_maintenance === 1) {

            setSummaryData([
                {
                    title: 'Driver name',
                    description: shiftDetailsData?.driver_user?.name,
                },
                {
                    title: 'License plate',
                    description: shiftDetailsData?.car?.car_license_plate_number,
                },
                {
                    title: 'Shift date',
                    description: formatDate(shiftDetailsData?.start_date),
                },
                {
                    title: 'End date', description: formatDate(shiftDetailsData?.end_date)
                },
                {
                    title: 'Shift time',
                    description: formatTimeHourMinutes(shiftDetailsData?.start_time ? shiftDetailsData?.start_time : "00:00:00") + ' - ' + formatTimeHourMinutes(shiftDetailsData?.end_time ? shiftDetailsData?.end_time : "00:00:00"),
                },
                {
                    title: 'Requests',
                    description: (shiftDetailsData?.length ?? 0) + (shiftDetailsData?.length > 1 ? ' requests' : ' request'),
                },
                {
                    title: 'Stops',
                    description: (shiftDetailsData?.stops_count ?? 0) + (shiftDetailsData?.stops_count > 1 ? ' stops' : ' stop'),
                },
                {
                    title: 'Packages',
                    description: (shiftDetailsData?.products_count ?? 0) + (shiftDetailsData?.products_count > 1 ? ' packages' : ' package'),
                },
            ]);
        } else {
            setSummaryData([
                {
                    title: 'Driver name',
                    description: shiftDetailsData?.driver_user?.name,
                },
                {
                    title: 'License plate',
                    description: shiftDetailsData?.car?.car_license_plate_number,
                },
                {
                    title: 'Shift date',
                    description: formatDate(shiftDetailsData?.start_date),
                },
                {
                    title: 'Shift time',
                    description: formatTimeHourMinutes(shiftDetailsData?.start_time ? shiftDetailsData?.start_time : "00:00:00") + ' - ' + formatTimeHourMinutes(shiftDetailsData?.end_time ? shiftDetailsData?.end_time : "00:00:00"),
                },
                {
                    title: 'Requests',
                    description: (shiftDetailsData?.length ?? 0) + (shiftDetailsData?.length > 1 ? ' requests' : ' request'),
                },
                {
                    title: 'Stops',
                    description: (shiftDetailsData?.stops_count ?? 0) + (shiftDetailsData?.stops_count > 1 ? ' stops' : ' stop'),
                },
                {
                    title: 'Packages',
                    description: (shiftDetailsData?.products_count ?? 0) + (shiftDetailsData?.products_count > 1 ? ' packages' : ' package'),
                },
            ])
        }
    }, [shiftDetailsData]);

    return (
        <div onClick={() => { console.log('shiftDetailsData', shiftDetailsData); }}>
            <CommonTopTitleSection
                withBackLink={"/shift-manager"}
                title={'Shift Details'}
                rightSideComponent={
                    shiftDetailsData?.status === 'init' ?
                        <div className='flex xl:flex-row flex-col xl:items-center items-baseline space-y-2.5 xl:space-y-0 xl:space-x-2.5'>
                            <div className='flex items-center space-x-2.5' >
                                <CommonButtonOutlined btnLabel='delete' colorType='danger' onClick={() => setShowDeleteShiftModal(true)} />
                                <CommonButton
                                    btnLabel='edit'
                                    onClick={() => { setShowEditShiftModal(true); }}
                                />
                            </div>
                        </div>
                        : ""
                }
            />


            <div className='h-full flex items-start space-x-s30' >

                <div className='w-full'>
                    {/*e         shift overview */}
                    <div className="w-full pb-6">
                        <ShiftOverView />
                    </div>
                    {
                        shiftDetailsData?.reqs?.length > 0 ?
                            <div className="w-full">
                                <ShiftDetailsTable dataArray={shiftDetailsData?.reqs} />
                            </div>
                            : <div className='w-full text-[24px] text-cTextGray limadi-semibold text-center pt-s100' >No request assigned to this shift yet!</div>
                    }
                    {
                        shiftDetailsData?.status === 'complete' || shiftDetailsData?.status === 'ongoing' ?
                            <div className="pt-6 w-full">
                                <ShiftLogBookTable />
                            </div>
                            : ""
                    }
                </div>

                {/*e             right sections.. */}

                <div className='h-full w-[400px]'>
                    {/*l        shift summary */}
                    <Summary
                        content={summaryData}
                    />

                    {shiftDetailsData?.is_maintenance === 1 ? "" : <div className="my-4 p-4 rounded-md border border-cMainBlue">
                        <div className='limadi-medium text-base'>
                            Shift Instruction
                        </div>
                        <div className="pt-2 w-full break-words">{shiftDetailsData?.comment ?? "NA"}</div>
                    </div>}

                    {/*b            route overview */}
                    {shiftRouteList?.length > 0 ?
                        <>
                            <div className='pt-5'>
                                {/* <SecondaryTitle title={'Route Overview (' + (dummyList?.length ?? 0) + ')'} /> */}
                                <SecondaryTitle title={'Route Overview (' + (shiftRouteList?.length ?? 0) + ')'} />
                            </div>
                            <div className='space-y-5 w-full pb-10'>
                                {
                                    // dummyList?.length > 0 ? dummyList?.map((item, index) =>
                                    shiftRouteList?.length > 0 ? shiftRouteList?.map((item, index) =>
                                        <CommonStopsList
                                            key={index}
                                            totalKm={parseInt(item?.distance / 1000)}
                                            time={item?.approx_time ?? "00:00"}
                                            count={item?.q_index ?? "NA"}
                                            routeType={item?.stop_type}
                                            title={item?.title}
                                            subTitleOne={(item?.stop_details?.products?.length ?? 0) + ' Packages'}
                                            subTitleTwo={item?.address ?? "NA"}

                                            accentType={item?.status === 'on_hold' ? 'on_hold' : 'transparent'}

                                            accentBorderType={
                                                item?.status === 'on_hold' ? 'on_hold'
                                                    : item?.status === 'on_going' ? 'warning'
                                                        : item?.q_index === null ? 'danger'
                                                            : item?.q_index && item?.status === 'un_optimized' ? 'danger'
                                                                : item?.status === 'complete' && item?.stop_status === 'not_delivered' ? 'danger'
                                                                    : item?.status === 'complete' && item?.stop_status === 'delivered' ? 'base'
                                                                        : 'transparent'
                                            }

                                            circleColorType={
                                                item?.status === 'on_hold' || item?.status === 'on_going' ? 'warning'
                                                    : item?.q_index === null ? 'danger'
                                                        : item?.q_index && item?.status === 'un_optimized' ? 'danger'
                                                            : item?.status === 'complete' && item?.stop_status === 'not_delivered' ? 'danger'
                                                                : item?.status === 'complete' && item?.stop_status === 'delivered' ? 'base'
                                                                    : 'transparent'
                                            }

                                            topRightComponent={
                                                item?.q_index && item?.status === 'un_optimized' ? 'Time Conflict'
                                                    : item?.q_index === null ? 'Not Calculated'
                                                        : item?.status === 'complete' && item?.stop_status === 'delivered' ? 'Completed'
                                                            : item?.status === 'complete' && item?.stop_status === 'not_delivered' ? 'Not Delivered'
                                                                : item?.status === 'on_going' ? 'On Going'
                                                                    : item?.status === 'on_hold' ? 'On Hold'
                                                                        : item?.status
                                            }

                                            topRightComponentType={
                                                item?.status === 'on_hold' ? 'on_hold'
                                                    : item?.status === 'on_going' ? 'warning'
                                                        : item?.q_index === null ? 'danger'
                                                            : item?.q_index && item?.status === 'un_optimized' ? 'danger'
                                                                : item?.status === 'complete' && item?.stop_status === 'not_delivered' ? 'danger'
                                                                    : item?.status === 'complete' && item?.stop_status === 'delivered' ? 'base'
                                                                        : 'transparent'
                                            }
                                        />
                                    )
                                        : ""
                                }

                            </div>
                        </>
                        : ""
                    }
                </div>
            </div>
        </div>

    )
}

export default ShiftDetails