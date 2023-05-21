import React from 'react'
import { useEffect } from 'react'
import useSettingsStore, { getTermsAndCondition } from '../../../app/stores/others/settingsStore'
import { changePageTitle } from '../../../app/utility/utilityFunctions';
import SettingsTitle from './SettingsTitle'

function TermsConditions() {

    const { termsAndConditionData } = useSettingsStore();

    useEffect(() => {
        fetchTermsConditionsData();
        changePageTitle('Settings | Terms Conditions');
        window.scrollTo(0, 0);
    }, [])

    const fetchTermsConditionsData = async () => {
        await getTermsAndCondition()
    }


    return (
        <div>
            <SettingsTitle title="Terms & Conditions" />

            <div>
                <div className='text-fs16 font-fw500 text-cDarkGray'>
                    {termsAndConditionData?.terms_condition?.description === "null" || termsAndConditionData?.terms_condition?.description === undefined ||
                        termsAndConditionData?.terms_condition?.description === null ? 'No Terms & Conditions Available'
                        : <div dangerouslySetInnerHTML={{ __html: termsAndConditionData?.terms_condition?.description }}></div>}
                </div>
            </div>
        </div>
    )
}

export default TermsConditions
