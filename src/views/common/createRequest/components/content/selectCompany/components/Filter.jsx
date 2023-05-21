import React, { } from 'react'
import useCreateRequestStore from '../../../../../../../app/stores/others/createRequestStore';
import ChipButton from '../../../../../../../components/button/ChipButton'
import RatingChipContent from '../components/RatingChipContent'

export default function Filter() {
  const { is_fav_selected, setFavSelected, rate, setRate } = useCreateRequestStore();

  return (
    <div className='flex flex-row justify-start space-x-5 my-5 items-center'>

      <ChipButton content={<RatingChipContent value={rate} onChange={(e) => setRate(e.target.value)} />} />
      <ChipButton content={'Favorite Companies'} is_selected={is_fav_selected} onClick={() => setFavSelected(!is_fav_selected)} />

    </div>
  )
}
