import { t } from 'i18next';
import React, { useState } from 'react'
import useCreateRequestStore from '../../../../../../../app/stores/others/createRequestStore';
import CommonButton from '../../../../../../../components/button/CommonButton';
import CommonInput from '../../../../../../../components/input/CommonInput';
import CommonModal from '../../../../../../../components/modal/CommonModal';
// import { addStop } from '../../../../App/CreateRequestStore';

const GenerateTableModal = ({ is_show, setShowModal }) => {
  const [num_of_stops, setNumOfStops] = useState(null);
  const {setStops, stops} = useCreateRequestStore();

  const onSubmit = (e) => {
    e.preventDefault();
    let x = [];
    for (let i = 0; i < num_of_stops; i++) 
    x.push(i);
    setStops(x);
    console.log('stops', stops, x);
    setShowModal(false);
    setNumOfStops(0);
  }
  return (
    <CommonModal
      showModal={is_show}
      setShowModal={setShowModal}
      modalTitle={t("Generate Table")}
      mainContent={
        <>
          <form onSubmit={onSubmit}>
            <CommonInput
              onChange={(e) => setNumOfStops(e.target.value)}
              type="number"
              name="num_of_stops"
              value={num_of_stops}
              labelText={"Number of Stops"}
              min={1}
              max={100}
              required={true}
              
            />

            <div className="flex flex-row justify-center mt-5">

              <CommonButton
                btnLabel={("Generate")}
                onClick={() => { }}
                type="submit"
              />
            </div>
          </form>
        </>
      }
    />
  )
}


export default GenerateTableModal