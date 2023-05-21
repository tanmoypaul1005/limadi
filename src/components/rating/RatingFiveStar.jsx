import React, { useEffect, useState } from 'react'
import { iFiveStar, iFourStar, iOneStar, iThreeStar, iTwoStar, iZeroStar } from '../../app/utility/imageImports';


const RatingFiveStar = ({ rating = 3 }) => {
    const [ratingIcon, setRatingIcon] = useState(iThreeStar);
    useEffect(() => {
        switch (rating) {
            case 0:
                setRatingIcon(iZeroStar);
                break;
            case 1:
                setRatingIcon(iOneStar);
                break;
            case 2:
                setRatingIcon(iTwoStar);
                break;
            case 3:
                setRatingIcon(iThreeStar);
                break;
            case 4:
                setRatingIcon(iFourStar);
                break;
            case 5:
                setRatingIcon(iFiveStar);
                break;

            default:
                break;
        }
    }, [rating])
    return (
        <div>
            <img src={ratingIcon} alt="" />
        </div>
    )
}

export default RatingFiveStar