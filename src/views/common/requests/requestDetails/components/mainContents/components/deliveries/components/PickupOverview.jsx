import React from 'react'
import ImageViewer from '../../../../../../../../../components/image/ImageViewer'
import CommonViewComponent from '../../../../../../../../../components/viewer/CommonViewComponent'
import RequestDetailsTextTitle from '../../RequestDetailsTextTitle'

export default function PickupOverview({ comment, attachment, signature }) {
  return (
    <>
      {
        (comment || attachment || signature) ? <>
          <RequestDetailsTextTitle title={`Pickup Overview`} className={'text-fs16 font-fw500'} />

          <CommonViewComponent
            labelText='Driver Comment'
            value={comment ?? 'NA'}
            className='my-[20px]'
          />

          <div className='flex flex-row justify-start items-center my-s20 space-x-5'>

            {attachment && <ImageViewer src={attachment} label={'Attachment'} />}
            {signature && <ImageViewer src={signature} label={'Signature'} is_signature={true} />}

          </div>

        </>
          :
          <></>
      }
    </>
  )
}
