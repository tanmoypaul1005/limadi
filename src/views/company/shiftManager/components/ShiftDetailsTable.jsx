import React from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '../../../../app/utility/utilityFunctions'

const ShiftDetailsTable = ({ dataArray }) => {
    return (
        <div className='w-full' >
            <table className='w-full font-medium'>
                <tr className='text-left font-semibold'>
                    <td className='pl-0'>Request List</td>
                    <td className='pl-2'>Stops</td>
                    <td className='pl-2'>Packages</td>
                    <td className='pl-0 text-left'>
                        Starts
                    </td>
                </tr>
                <tr className='h-4'></tr>
                {
                    dataArray?.map((item, index) =>
                        <CustomTableRow
                            data={item}
                            key={index}
                            Request={item?.title}
                            Stops={item?.stops_count ?? 0}
                            Packages={item?.products_count ?? 0}
                            Starts={item?.pickup_starts_date ? formatDate(item?.pickup_starts_date) : "" + ' ' + item?.pickup_starts_time ?? ""}
                        // Starts={formatDate(item?.pickup_starts_date) + ' ' + item?.pickup_starts_time + ' - ' + 'p_end_time'}
                        />
                    )
                }
            </table>
        </div>
    )
}

export default ShiftDetailsTable

const CustomTableRow = ({
    data = {},
    Request = "NA",
    Stops = "0",
    Packages = "0",
    Starts = "NA",
}) => {
    const navigateTo = useNavigate();


    const handleNavigateTo = (data) => {
        if (data?.status === 'invitation') {
            navigateTo(`/requests/saved/details/${data?.id}`);
        } else if (data?.status === 'in_bidding') {
            navigateTo(`/requests/in-bidding/details/${data?.id}`);
        } else if (data?.status === 'awarded') {
            navigateTo(`/requests/planned/details/${data?.id}`);
        } 
        // else if (data?.status === 'awarded' && !data?.awarded_bidding.is_planned) {
        //     navigateTo(`/requests/not-planned/details/${data?.id}`);
        // } 
        else if (data?.status === 'ongoing') {
            navigateTo(`/requests/on-going/details/${data?.id}`);
        } else if (data?.status === 'completed') {
            navigateTo(`/requests/completed/details/${data?.id}`);
        } else if (data?.status === 'history') {
            navigateTo(`/requests/history/details/${data?.id}`);
        } else navigateTo(`/requests/saved/details/${data?.id}`);
    }

    return (
        <>
            <tr onClick={() => { handleNavigateTo(data) }} className='w-full border-b-[1px] border-cMainBlue text-cMainBlue cursor-pointer'>
                <td className='max-w-[180px] pl-0 truncate font-semibold'>{Request}</td>
                <td className='pl-2 min-w-[80px]'>{Stops}</td>
                <td className='pl-2 min-w-[80px]'>{Packages}</td>
                <td className='pl-0 max-w-[1px]'>
                    {Starts}
                </td>
            </tr>
            <tr className='h-3'></tr>
        </>
    )
}