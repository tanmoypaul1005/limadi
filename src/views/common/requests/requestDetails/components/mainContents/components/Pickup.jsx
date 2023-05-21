import React from 'react'
import { useParams } from 'react-router-dom'
import { checkIsShowPickupOrDeliveryStatus, definePickupAndDeliveryStatus } from '../../../../../../../app/stores/others/requestStore'
import { formatDate, formatTime } from '../../../../../../../app/utility/utilityFunctions'
import ImageViewer from '../../../../../../../components/image/ImageViewer'
import CommonViewComponent from '../../../../../../../components/viewer/CommonViewComponent'
import RequestDetailsTextTitle from './RequestDetailsTextTitle'
import PickupOverview from './deliveries/components/PickupOverview'

export default function Pickup({ data }) {
  const params = useParams();
  const { type } = params;

  return (
    <>
      <div className='space-y-2 w-[calc(100%-380px)]  border-cGrey border-[0.5px] p-3'>
        <RequestDetailsTextTitle
          title='pickup overview'
          is_show_delivery_status={checkIsShowPickupOrDeliveryStatus(data?.pickup_status, type)}
          is_delivered={data?.pickup_status === 'delivered' ? true : false}
          status={data?.pickup_status}
          date_time={definePickupAndDeliveryStatus(data, 'pickup')}
        />

        <CommonViewComponent labelText='title' value={data?.title} />
        <CommonViewComponent labelText='type of transportation' value={data?.transport_type} />
        <CommonViewComponent labelText='Pickup Address' value={data?.pickup_address} />

        <CommonViewComponent labelText='Pickup date' value={formatDate(data?.pickup_date)} />
        <CommonViewComponent labelText='Pickup time' value={formatTime(data?.pickup_start_time)} />

        <CommonViewComponent labelText='comment' value={data?.pickup_comment ?? 'NA'} />

        {data?.pickup_attachment && <ImageViewer src={data?.pickup_attachment} label={'Attachment'} />}

        {((type === 'on-going' || type === 'history' || type === 'completed')) && <PickupOverview comment={data?.pickup_driver_comment} attachment={data?.pickup_driver_attachment} signature={data?.pickup_driver_signature} />}
      </div>
    </>
  )
}
