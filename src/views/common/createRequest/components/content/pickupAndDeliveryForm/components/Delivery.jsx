import React, { useState } from 'react'
import useGeneralStore from '../../../../../../../app/stores/others/generalStore';
import { iPlus, iRedCancel, iTrash, iWhitePlus } from '../../../../../../../app/utility/imageImports';
import CommonButton from '../../../../../../../components/button/CommonButton';
import ImageUpload from '../../../../../../../components/imageUpload/ImageUpload'
import AddressAutoComplete from '../../../../../../../components/input/AddressAutoComplete';
import CommonDatePicker from '../../../../../../../components/input/CommonDatePicker';
import CommonInput from '../../../../../../../components/input/CommonInput'
import CommonTimePicker from '../../../../../../../components/input/CommonTimePicker';
import { user_role as role } from '../../../../../../../app/utility/const';
import useCreateRequestStore from '../../../../../../../app/stores/others/createRequestStore';
import { formatDate, formatDateToApiDate } from '../../../../../../../app/utility/utilityFunctions';

export default function Delivery() {

  const { cr_form, addDelivery, removeDelivery, addDeliveryProduct, removeDeliveryProduct, updateStopsForm, changeProductValue } = useCreateRequestStore();
  const { stops } = cr_form;
  const [doSearch, setDoSearch] = useState(false);

  const handleAddDelivery = () => {
    addDelivery();

    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight - window.innerHeight,
        behavior: "smooth"
      });
    }, 300);
  }


  return (
    <>
      {
        stops.map((item, index) => (
          <div className='mb-5' key={index}>
            <div className='flex flex-row justify-start space-x-6'>
              <div className='sub-title'>Delivery {index + 1}</div>
              {(stops.length > 1) && <img onClick={() => removeDelivery(index)} src={iTrash} alt="" srcset="" className='cursor-pointer' />}
            </div>

            <AddressAutoComplete
              required={true}
              label='Delivery Address'
              name={'address'}
              address={cr_form?.stops[index]?.address}
              latName={'lat'}
              lngName={'lng'}
              changeValue={(name, value) => {
                if (name === "address") {
                  updateStopsForm(index, 'address', value);
                } else if (name === "lat") {
                  updateStopsForm(index, 'lat', value);
                } else if (name === "lng") {
                  updateStopsForm(index, 'lng', value);
                }
              }}
              doSearch={doSearch}
              setDoSearch={setDoSearch}
              onFavAddressModalItemClick={(address) => {
                updateStopsForm(index, 'address', address?.address);
                updateStopsForm(index, 'lat', address?.lat);
                updateStopsForm(index, 'lng', address?.lng);
                console.log('address', address);
              }}
            />

            {/* Delivery date and time */}
            {
              useGeneralStore.getState().user_role === role.company &&
              <div className='flex flex-row justify-between w-full space-x-7 mt-4'>
                <div className='w-full'>
                  <CommonDatePicker required={true} allowPastDate={false} label='Delivery Date' name='formatted_date' value={cr_form?.stops[index]?.formatted_date} onChange={(date) => {
                    updateStopsForm(index, 'formatted_date', formatDate(date));
                    updateStopsForm(index, 'date', formatDateToApiDate(date));

                  }} />
                </div>
                <div className='w-full mt-1.5'>
                  <CommonTimePicker required={true} label='Delivery Time' init_time={cr_form?.stops[index]?.start_time} end_time={cr_form?.stops[index]?.end_time} name='start_time' onChange={(start_time, end_time) => {
                    updateStopsForm(index, 'start_time', start_time);
                    updateStopsForm(index, 'end_time', end_time);
                  }} />
                </div>
              </div>
            }


            {
              item?.products?.map((productItem, productIndex) => (
                <div className='relative'>
                  <CommonInput required={true} labelText='Product' name={'product'} value={cr_form?.stops[index]?.products[productIndex]?.text}
                    onChange={(e) => {
                      changeProductValue(e.target.value, index, productIndex)
                    }} />
                  {item?.products?.length > 1 && <img onClick={() => removeDeliveryProduct(index, productIndex)} className='absolute top-4 right-0 cursor-pointer' src={iRedCancel} alt="" srcset="" />}
                </div>
              ))
            }

            <AddProduct onClick={() => addDeliveryProduct(index)} />


            <div className='mt-5'> <CommonInput labelText='Comment (Optional)' name={'comment'} value={cr_form?.stops[index]?.comment}
              onChange={(e) => {
                updateStopsForm(index, 'comment', e.target.value);
              }} textarea={true} max_input={255} /></div>

            <div className='mt-8'>
              <ImageUpload
                setImage={(value) => {
                  updateStopsForm(index, 'attachment', value);

                }}
                image_url={cr_form?.stops[index]?.attachment_url}
                src={cr_form?.stops[index]?.attachment}
                setSrc={(value) => {
                  // console.log('value', cr_form?.stops[index]?.has_old_image, value);
                  // if (cr_form?.stops[index]?.has_old_image && !value) updateStopsForm(index, 'attachment', 'remove');
                  // else updateStopsForm(index, 'attachment', value);

                  updateStopsForm(index, 'attachment', value);

                  updateStopsForm(index, 'temp_attachment', value);
                }}
              />
            </div>

          </div>
        ))
      }

      <div className='flex flex-row justify-center'>
        <CommonButton
          btnLabel='Add Delivery'
          icon={iWhitePlus}
          mediumSize={true}
          onClick={handleAddDelivery}
        />
      </div>
    </>
  )
}

const AddProduct = ({ onClick }) => {
  return (
    <div onClick={onClick} className='flex flex-row justify-start space-x-2 items-center cursor-pointer mt-5'>
      <img src={iPlus} alt="" srcset="" />
      <div className='text-cMainBlue text-fs16 font-fw500'>Add Product</div>
    </div>
  )
}
