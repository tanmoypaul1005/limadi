import React from 'react'
import CommonModal from '../../../../components/modal/CommonModal'
import useNotificationStore from '../../../../app/stores/others/notificationStore'
import { iCalendar, iClock } from '../../../../app/utility/imageImports';
import { formatDate } from '../../../../app/utility/utilityFunctions';

function NotificationDetailsModal() {

    const { showNotificationDetailsModal, setShowNotificationDetailsModal, notificationDetails } = useNotificationStore();

    return (
        <div>
            <CommonModal
                showModal={showNotificationDetailsModal}
                setShowModal={setShowNotificationDetailsModal}
                modalTitle="Notification Details"
                mainContent={
                    <>
                        <div className="text-cMainBlack text-fs18 font-fw600 mt-s20">{notificationDetails.title ?? 'NA'}</div>
                        <div className="text-cMainBlack text-fs16 font-fw400 mt-s5=4">{notificationDetails.description ?? 'NA'}</div>

                        <div className='flex justify-between mt-s5'>
                            <div className='flex'>
                                <div className='flex mr-s10'>
                                    <img  src={iCalendar} alt="" />
                                    <span className='ml-s5 text-fs14 font-fw400 text-cDisable break-all'>{formatDate(notificationDetails?.created_date)}</span></div>
                                <div className='flex'>
                                    <img  src={iClock} alt="" />
                                    <span className='ml-s5 text-fs14 font-fw400 text-cDisable break-all'>{notificationDetails?.created_time}</span></div>
                            </div>
                        </div>
                    </>

                }
            />
        </div>
    )
}

export default NotificationDetailsModal
