import React, { useEffect } from 'react'
import useGeneralStore from '../../../app/stores/others/generalStore';
import { k_page_titles, user_role as role } from '../../../app/utility/const';
import { changePageTitle } from '../../../app/utility/utilityFunctions';
import { default as CompanyHomePage } from '../../company/homePage/HomePage';
import { default as CustomerHomePage } from '../../customer/homePage/HomePage';


function Dashboard() {
    const { user_role } = useGeneralStore();

    useEffect(() => {
        changePageTitle(k_page_titles.home);
        window.scrollTo(0, 0);
    }, [])


    return (
        <>
            {user_role === role.customer ? <CustomerHomePage /> : <CompanyHomePage />}
        </>
    )
}

export default Dashboard
