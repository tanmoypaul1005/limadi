import React, { useEffect, useState } from 'react';
import useShiftStore from '../../../../app/stores/company/shiftStore';
import { secondsToHms } from '../../../../app/utility/utilityFunctions';

const ShiftOverView = () => {
    const { shiftDetailsData } = useShiftStore();
    const [shiftStatusColor, setShiftStatusColor] = useState('');
    const [shiftStatusTitle, setShiftStatusTitle] = useState('');

    useEffect(() => {

        switch (shiftDetailsData?.status) {
            case 'complete':
                setShiftStatusColor('text-cSuccess'); setShiftStatusTitle('Completed');
                break;

            case "ongoing":
                setShiftStatusColor('text-cBrand'); setShiftStatusTitle('Ongoing');
                break;

            case 'init':
                if (shiftDetailsData?.is_maintenance === 1) {
                    setShiftStatusColor('text-cBrand'); setShiftStatusTitle('In Maintenance');
                }
                else if (shiftDetailsData?.is_maintenance === 0) {
                    setShiftStatusColor('text-cRed'); setShiftStatusTitle('Not Started');
                }
                break;

            default:
                setShiftStatusColor('text-cBrand'); setShiftStatusTitle('');
                break;
        }
    }, [shiftDetailsData]);
    return (
        <div
            onClick={() => {
                console.log("shiftDetailsData", shiftDetailsData);
            }}
            className='w-full'
        >
            <div className='flex items-center space-x-2 pb-4'>
                <div className='text-base limadi-medium '>Shift Overview</div>
                <div className={`text-xs font-normal ${shiftStatusColor}`} >({shiftStatusTitle})</div>
            </div>


            <div className="grid grid-cols-3 md:grid-cols-6 w-full gap-4">

                <OverViewItem title='requests' data={(shiftDetailsData?.request_completed ?? 0) + '/' + (shiftDetailsData?.request_count ?? 0)} />
                <OverViewItem title='stops' data={(shiftDetailsData?.stops_completed ?? 0) + '/' + (shiftDetailsData?.stops_count ?? 0)} />
                <OverViewItem title='packages' data={(shiftDetailsData?.products_completed ?? 0) + '/' + (shiftDetailsData?.products_count ?? 0)} />

                <OverViewItem title='breaks' data={secondsToHms(shiftDetailsData?.breaks ?? 0)} />
                <OverViewItem title='working hours' data={secondsToHms(shiftDetailsData?.driven ?? 0)} />
                <OverViewItem title='total hours' data={secondsToHms(shiftDetailsData?.driven_count ?? 0)} />

            </div>
        </div>
    )
}

export default ShiftOverView

const OverViewItem = ({ title = 'Title', data = 'DATA' }) => {
    return (
        <div className='flex flex-col items-center justify-center border-[1px] border-cLightGrayishBlue py-2 rounded-sm'>
            <div className='text-xs capitalize'>{title}</div>
            <div className='text-base limadi-medium' >{data}</div>
        </div>
    )
}