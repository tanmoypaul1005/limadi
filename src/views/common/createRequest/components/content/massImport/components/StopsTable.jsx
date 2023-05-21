import React, { useEffect, useState } from 'react'
import useCreateRequestStore from '../../../../../../../app/stores/others/createRequestStore';
import useGeneralStore from '../../../../../../../app/stores/others/generalStore';
import StopRow from './StopRow';
import { Tooltip } from 'antd';
import { AiFillCloseCircle } from 'react-icons/ai';
import { FaList, FaPaste } from 'react-icons/fa'
import CommonButton from '../../../../../../../components/button/CommonButton';
import { Toastr } from '../../../../../../../app/utility/utilityFunctions';
import CommonModal from '../../../../../../../components/modal/CommonModal';
import CommonButtonOutlined from '../../../../../../../components/button/CommonButtonOutlined';
import TableHeader from './TableHeader';
import { user_role as role } from '../../../../../../../app/utility/const';

export default function StopsTable() {

  const { stops, validateStops, is_every_thing_valid, setIsEveryThingValid, setIsClickOnValidate, invalid_count, first_invalid_index, is_mass_import_form_fullscreen, setInvalidCount, setMassImportFormFullscreen, setStops } = useCreateRequestStore();
  const [count, setCount] = useState(10);

  const addMoreStops = () => {
    // if (count < 1 || count > 100) {
    //   Toastr('Please enter a number between 1 and 100', 'warning');
    //   return;
    // }
    // // for (let i = 0; i < count; i++) addStop();
    // setIsEveryThingValid(false);
    let x = [...stops];
    x.push(1);
    setStops(x);
  }



  return (
    <div className={`${is_mass_import_form_fullscreen ? 'h-[100%] fixed bg-gray-200 left-0 right-0 bottom-0 top-0 w-[100%] overflow-auto z-[100001] p-3' : ''}`}>


      <div className={`flex  flex-col max-w-full items-start relative  overflow-x-auto ${is_mass_import_form_fullscreen ? "w-full" : "w-[1450px]"}`}>
        {
          <>

            <TableHeader />

            <PasteInfo />

            <div className={`${is_mass_import_form_fullscreen ? "w-full" : "w-full"} overflow-x-auto px-[10px] bg-cCommonListBG`}>
              <Header />
              <div id='scr' className={`min-h-[55vh] max-h-[55vh] w-full z-50 scroll-smooth bg-cCommonListBG`}>
                {
                  stops.map((stop, index) => {
                    return <StopRow id={index} key={index} data={stop} index={index} />
                  })
                }
              </div>

            </div>

            {!is_every_thing_valid && (invalid_count > 0) && stops.length > 0 && <ErrorCountAndResolve invalid_count={invalid_count} first_invalid_index={first_invalid_index} />}



            <div className='text-cMainBlack text-fs14 font-fw600 my-5 flex flex-row items-center justify-between h-auto space-x-2 w-full pl-[2px]'>
              <CommonButtonOutlined btnLabel={'Add More'} onClick={addMoreStops} />

              <CommonButton btnLabel='Validate' />
            </div>



          </>

        }
      </div>

    </div>
  )
}



const PasteInfo = () => {
  return (
    <div className='text-center bg-cLiteGrey text-cBrand text-fs14  py-3 w-max rounded-br5 mt-4 mb-0 max-w-[90%]'>
      {"***Please fill up the information in the table manually or Copy your information and paste here.***"}
    </div>
  );
}


const Header = () => {
  const [is_show, setShow] = useState(false);
  const [is_show_AdditionStopAlertModal, setShowAdditionStopAlertModal] = useState(false);
  const { pasteStopInfo, stops } = useCreateRequestStore();
  const [additionalStops, setAdditionStops] = useState(0);
  const [property, setProperty] = useState(null);
  const { setIsAddressFieldDisable, setIsClickOnValidate, setIsEveryThingValid, is_mass_import_form_fullscreen, setStops } = useCreateRequestStore();
  const { setLoading, user_role } = useGeneralStore();

  const pasteInfo = async (property) => {
    // check permission first
    const permission = await navigator.permissions.query({ name: "clipboard-read" });
    if (permission.state === "denied") {
      alert("You need to allow clipboard access to paste data");
      return;
    }

    // prevent auto suggestion on paste
    setLoading(true)
    const text = await navigator.clipboard.readText();
    // convert text to array of lines
    let data = text.split('\n');
    // console.log('paste data: ', data);

    // prevent use from multiple colum paste
    if (data[0].includes('\t')) {
      Toastr('You cannot paste multiple column', 'warning');
      setLoading(false);
      return;
    }

    // data = formatPasteData(data)

    if (property === 'address') data = data.map(item => item.trim());
    if (property === 'zip') data = data.map(item => item.replace(/\r?\n|\r/g, ''))
    // console.log('formated paste data: ', data);

    let check = 0;
    if (property === 'zip') data.map(item => {
      // check if the zip is a number or not
      if (isNaN(item) && check === 0) {
        Toastr('Only number can be pasted', 'warning');
        check = 1;
        return 0;
      }
      return 0;
    });

    if (property === 'address') {
      setIsAddressFieldDisable(true);
      setIsClickOnValidate(true);
      setIsEveryThingValid(false);
      setTimeout(() => { setIsAddressFieldDisable(false); }, 1);
      setTimeout(() => {
        setIsClickOnValidate(false);
      }, 500);
    }

    useCreateRequestStore.getState().setPasteData(data);
    setProperty(property);

    if (data.length > stops.length) {
      setAdditionStops(data.length - stops.length);
      setShowAdditionStopAlertModal(true);
    }
    else pasteStopInfo(data, property);
    setLoading(false)
  }


  return (
    <div className={`flex flex-row ${is_mass_import_form_fullscreen ? "w-full" : user_role === role.customer ? "w-[1400px]" : "w-[1640px]"} justify-between items-center px-[10px] py-2 text-cBodyText text-fs14 font-fw500 space-x-s5 `}>
      <div className='w-[40px] text-center'>#({stops.length})</div>

      <div className={`${is_mass_import_form_fullscreen ? "w-[20%]" : "w-[200px]"}`}>
        <HeaderItem onClick={() => pasteInfo('stop_reference')} label={'Stop Reference*'} />
      </div>

      {
        user_role === role.company &&
        <>
          <div className={`${is_mass_import_form_fullscreen ? "w-[10%]" : "w-[120px]"}`}>
            <HeaderItem onClick={() => pasteInfo('date')} label={'Date*'} />
          </div>

          <div className={`${is_mass_import_form_fullscreen ? "w-[10%]" : "w-[120px]"}`}>
            <HeaderItem onClick={() => pasteInfo('start_time')} label={'Time*'} />
          </div>
        </>
      }

      <div className={`${is_mass_import_form_fullscreen ? "w-[25%]" : "w-[400px]"}`}>
        <HeaderItem onClick={() => pasteInfo('address')} label={'Address*'} />
      </div>

      <div className={`${is_mass_import_form_fullscreen ? "w-[10%]" : "w-[100px]"}`}>
        <HeaderItem onClick={() => pasteInfo('zip')} label={'Zip*'} />
      </div>

      <div className={`${is_mass_import_form_fullscreen ? "w-[25%]" : "w-[400px]"}`}>
        <HeaderItem onClick={() => pasteInfo('product')} label={'Product*'} />
      </div>

      <div className={`${is_mass_import_form_fullscreen ? "w-[20%]" : "w-[300px]"}`}>
        <HeaderItem onClick={() => pasteInfo('comment')} label={'Comment'} />
      </div>

      <Tooltip color={'#F89818'} title="Remove All Stops">
        <div className=' w-[40px] flex justify-center' onClick={() => { setShow(true); setStops([]) }}>
          <AiFillCloseCircle className='cursor-pointer text-cRed text-2xl' />
        </div>
      </Tooltip>

      {/* <RemoveAllStopConfirmationModal is_show={is_show} setShow={setShow} /> */}
      {/* <AddAdditionalStopsModal is_show={is_show_AdditionStopAlertModal} setShow={setShowAdditionStopAlertModal} additionalStops={additionalStops} property={property} /> */}
    </div>
  )
}

const HeaderItem = ({ label, onClick }) => {
  return (
    <div className='flex flex-row justify-center items-center  space-x-2'>
      <div className='w-fit'>{label}</div>
      <Tooltip color={'#F89818'} title="paste">
        <FaPaste onClick={onClick} className='cursor-pointer hover:text-cPrimary text-base' />
      </Tooltip>
    </div>
  )
}

const ErrorCountAndResolve = ({ invalid_count, first_invalid_index }) => {
  const { is_click_on_resolve } = useCreateRequestStore();
  return (
    <div className='text-center bg-cLiteGrey text-cRed text-fs14 px-5 py-3 w-max rounded-br5 my-4 max-w-[90%]'>
      {`***We found ${invalid_count} issues when validating data! `}
      {!is_click_on_resolve && <span className='font-fw600 text-cLink underline cursor-pointer'>
        <a onClick={() => {
          console.log('fii', first_invalid_index);
        }} href={`#${first_invalid_index}`}>Resolve</a>
      </span>}
    </div>
  );
}

// const RemoveAllStopConfirmationModal = ({ is_show, setShow }) => {
//   const { removeAllStops, setIsEveryThingValid } = useCreateRequestStore();
//   return (
//     <CommonModal
//       open={is_show}
//       setOpen={setShow}
//       title={("Remove All Stops")}
//       subtitle={("Are you sure you want to remove all stops?")}
//       body={
//         <>
//           <div className="flex flex-row justify-center mt-5">

//             <CommonButton
//               label={("Confirm")}
//               onSubmit={() => { removeAllStops(); setShow(false); setIsEveryThingValid(false); }}
//               btn_type="submit"
//               type="danger"
//             />

//           </div>
//         </>
//       }
//     />
//   );
// }


// const AddAdditionalStopsModal = ({ is_show, setShow, additionalStops, property }) => {
//   const { stops, generateAdditionalStopsAndPasteInfo } = useCreateRequestStore();

//   return (
//     <CommonModal
//       open={is_show}
//       setOpen={setShow}
//       title={("Warning")}
//       subtitle={(`You have copied ${stops.length + additionalStops} items but you have generated ${stops.length} rows. Increase ${additionalStops} rows by clicking below.`)}
//       body={
//         <>
//           <div className="flex flex-row justify-center mt-5">

//             <CommonButton
//               label={(`Increase ${additionalStops} stops`)}
//               onSubmit={() => {
//                 generateAdditionalStopsAndPasteInfo(additionalStops, property);
//                 setShow(false);
//               }}
//               btn_type="submit"
//               width='w-[180px]'
//             />

//           </div>
//         </>
//       }
//     />
//   );
// }