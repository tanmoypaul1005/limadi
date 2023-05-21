import React, { useEffect, useState } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import useCreateRequestStore from '../../../../../../../app/stores/others/createRequestStore';
import { formatDate, removeSecFromDeliveryTime } from '../../../../../../../app/utility/utilityFunctions';
import Dropdown from '../../../../../../../components/dropdown/Dropdown';
import MassImportAddressAutoComplete from '../../../../../../../components/input/MassImportAddressAutoComplete';
import Calendar from '../../../../../../../components/utility/Calendar';
import TimePickerNew from '../../../../../../../components/utility/TimePickerNew';
import { user_role as role } from '../../../../../../../app/utility/const';
import useGeneralStore from '../../../../../../../app/stores/others/generalStore';

export default function StopRow({ data, index, id }) {
  const { setStopPropertyValue, removeStop, is_address_field_disable, setIsEveryThingValid, is_mass_import_form_fullscreen, stops, setStops } = useCreateRequestStore();
  const [doSearch, setDoSearch] = useState(false)
  const {user_role} = useGeneralStore()

  const onChange = (e) => {
    setStopPropertyValue(index, e.target.name, e.target.value, e);
    if (e.target.name === 'product' && (e.target.value === null || e.target.value === '')) {
      setIsEveryThingValid(false)
    }

    if (e.target.name === 'zip') setIsEveryThingValid(false);
  }

  useEffect(() => {
    setDoSearch(false);

    let el = document.addEventListener("wheel", function (event) {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    });

    return () => {
      setDoSearch(false);
      document.removeEventListener("wheel", el);
    }
  }, []);

  const onDateSelect = (date) => {
    setStopPropertyValue(index, 'date', date);
    setIsEveryThingValid(false);
  }

  const onTimeSelect = (time, endTime) => {
    setStopPropertyValue(index, 'start_time', time)
    setStopPropertyValue(index, 'end_time', endTime)
    setIsEveryThingValid(false);
    // console.log('delivery start and end time: ', time, endTime);
  }

  return (
    <div id={id} className={`flex flex-row ${is_mass_import_form_fullscreen ? "w-full" : user_role === role.customer ? "w-[1400px]" : "w-[1640px]" } justify-between items-center px-[10px] py-[10px] rounded-br5 text-cBodyText text-fs14 font-fw500 bg-cGridView space-x-3 h-[40] my-1 `}>

      <div className='w-[40px] text-center'>{index + 1}</div>

      <InputField name={'stop_reference'} value={data?.stop_reference} onChange={onChange} width={`${is_mass_import_form_fullscreen ? "w-[20%]" : "w-[200px]"}`} />

      {/*//! date and time:: start */}

      <div className={`${is_mass_import_form_fullscreen ? "w-[10%]" : "w-[120px] mt-1"}`}>
        <Dropdown
          width={`w-full`}
          button={<InputField name={'date'} value={data?.date === null ? '' : formatDate(data?.date)} onChange={onChange} width={'w-full'} type="text" is_valid={data?.is_date_time_valid} />}
          body={<Calendar selectAction={onDateSelect} init_date={data?.date === null ? '' : formatDate(data?.date)} />}
        />
      </div>

      <div className={`${is_mass_import_form_fullscreen ? "w-[10%]" : "w-[120px] mt-1"}`}>
        <Dropdown
          width={`w-full`}
          button={<InputField name={'start_time'} value={data?.start_time === null ? '' : removeSecFromDeliveryTime(data?.start_time)} onChange={onChange} width={'w-full'} type="text" is_valid={data?.is_date_time_valid} />}
          body={<TimePickerNew selectAction={onTimeSelect} init_time={data?.start_time === null ? '' : removeSecFromDeliveryTime(data?.start_time)}
            endTime={data?.end_time === null ? '' : removeSecFromDeliveryTime(data?.end_time)} />}
        />
      </div>

      {/*//! date and time:: end */}

      <MassImportAddressAutoComplete
        name={'address'}
        address={data?.address}
        latName={'address_lat'}
        lngName={'address_lng'}
        changeValue={setStopPropertyValue}
        index={index}
        doSearch={doSearch}
        setDoSearch={setDoSearch}
        width={`${is_mass_import_form_fullscreen ? "w-[25%]" : "w-[400px]"}`}
        is_valid={data?.is_address_valid}
        isDisabled={is_address_field_disable}
      />

      <InputField name={'zip'} value={data?.zip === 0 ? '' : data?.zip} onChange={onChange} width={`${is_mass_import_form_fullscreen ? "w-[10%]" : "w-[100px]"}`} type="number" is_valid={data?.is_zip_valid} />

      <InputField name={'product'} value={data?.product} onChange={onChange} width={`${is_mass_import_form_fullscreen ? "w-[25%]" : "w-[400px]"}`} is_valid={data?.is_product_valid} is_textarea={true} />

      <textarea name={'comment'} value={data?.comment ?? ''} onChange={onChange} rows={1} className={`${is_mass_import_form_fullscreen ? "w-[20%]" : "w-[300px]"} px-1  py-2 text-sm rounded-br5 outline-cPrimary`} type="text" />

      <div onClick={() => {
        // removeStop(index);
        let x = [...stops];
        x.pop();
        setStops(x);

      }} className='text-2xl w-[40px] flex justify-center cursor-pointer text-cRed'> <AiFillCloseCircle /> </div>

    </div>
  )
}


const InputField = ({ width, value, onChange, name, is_valid = true, is_textarea = false, maxLength = null, type = 'text' }) => {

  return (
    <>
      {is_textarea ?
        <textarea rows={1} className={`${width} resize-none overflow-hidden px-1 py-2 text-sm rounded-br5 outline-cPrimary ${!is_valid ? "border-cRed border-[1px]" : ''}`} type="text" name={name} value={value} onChange={onChange} />
        :
        <input className={`${width} px-1 py-2 text-sm rounded-br5 outline-cPrimary ${!is_valid ? "border-cRed border-[1px]" : ''}`} type={type} name={name} value={value} onChange={onChange} maxLength={maxLength} />
      }
    </>
  );
}


