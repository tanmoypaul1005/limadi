import React from 'react';
import useShiftStore from '../../../../app/stores/company/shiftStore';
import { formatDate, getOrdinalNumber } from '../../../../app/utility/utilityFunctions';

const ShiftLogBookTable = () => {
    const { shiftDetailsData } = useShiftStore();
    return (
        <div className='w-full' >
            <div className='text-base limadi-medium pb-4'>Log Book</div>
            <table className='w-full font-medium'>
                {/* <tr className='text-left font-semibold'>
                    <td className='pl-0'></td>
                    <td className='pl-0'></td>
                    <td className='pl-5'></td>                    
                </tr>
                <tr className='h-4'></tr> */}
                <LogTableRow breakIndex='Shift Starts:' timeFrame={formatDate(shiftDetailsData?.started_at, true)} />
                {
                    shiftDetailsData?.log_books?.length ? shiftDetailsData?.log_books?.map((item, index) =>
                        <>
                            <LogTableRow
                                key={index}
                                breakIndex={getOrdinalNumber((index + 1)) + ' Break  Starts:'}
                                timeFrame={formatDate(item?.break_start, true)}
                            />
                            <LogTableRow
                                key={index + 500}
                                breakIndex={getOrdinalNumber((index + 1)) + ' Break  Ends:'}
                                timeFrame={formatDate(item?.break_end, true)}
                            />
                        </>
                    )
                        : ""
                }
            </table>
        </div>
    )
}

export default ShiftLogBookTable


const LogTableRow = ({
    breakIndex = '1st Break',
    startsAt = 'Start/End: ',
    timeFrame = 'Start/End: 9. Mar. 2023, 08:50',
}) => {
    return (
        <>
            <tr className='border-b-[1px] border-cMainBlack text-cMainBlack text-sm'>
                {/* <td className='max-w-[180px] pl-0 truncate font-normal'>{breakIndex}</td> */}
                <td className='min-w-[80px] text-left'>{breakIndex}</td>
                <td className='min-w-[80px] text-right'>{timeFrame}</td>
            </tr> <tr className='h-3'></tr>
        </>
    )
}