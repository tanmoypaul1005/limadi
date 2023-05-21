import React from 'react';
import { iNoBiddingIcon, iWhiteAdd } from '../../../../app/utility/imageImports';
import CommonButton from '../../../../components/button/CommonButton';

const NoBidding = () => {
    return (
        <div className='h-[400px] w-full flex justify-center items-center '>
            <div className='flex flex-col justify-center items-center'>
                <img src={iNoBiddingIcon} alt="iNoBiddingIcon" className='h-s130 w-s130 my-s15' />
                <div className='text-fs24 font-fw500 text-cCustomerBlack '>Nothing in In Bidding</div>
                <div className='text-fs14 font-fw400 text-cGrey mb-s15'>You have nothing in In Bidding list. Please create a request first.</div>
                <CommonButton
                    icon={iWhiteAdd}
                    btnLabel="Create Request"
                    isDisabled={false}
                    // width="w-[200px]"
                    // smallSize={true}
                    // mediumSize={true}
                    bigSize={true}
                />
            </div>
        </div>
    );
};

export default NoBidding;