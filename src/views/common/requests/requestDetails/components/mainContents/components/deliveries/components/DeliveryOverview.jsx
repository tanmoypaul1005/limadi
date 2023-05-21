import React from 'react'
import ImageViewer from '../../../../../../../../../components/image/ImageViewer'
import CommonViewComponent from '../../../../../../../../../components/viewer/CommonViewComponent'
import RequestDetailsTextTitle from '../../RequestDetailsTextTitle'

export default function DeliveryOverview({ stop, index }) {
  return (
    <>
      <RequestDetailsTextTitle title={`Delivery ${index + 1} Overview`} className={'text-fs16 font-fw500'} />

      <CommonViewComponent
        labelText='Driver Comment'
        value={stop?.driver_comment ?? 'NA'}
        className='my-[20px]'
      />

      <div className='flex flex-row justify-start items-center my-s20 space-x-5'>

        {stop?.driver_attachment && <ImageViewer src={stop?.driver_attachment} label={'Attachment'} />}
        {stop?.driver_signature && <ImageViewer src={stop?.driver_signature} label={'Signature'} is_signature={true} />}

      </div>

    </>
  )
}
