import React, { useEffect } from 'react';
import { changePageTitle } from '../../../app/utility/utilityFunctions';
import SimpleAccordion from '../../../components/Accordion/SimpleAccordion';
import SettingsTitle from './SettingsTitle';

const Faq = () => {

    useEffect(() => {
        changePageTitle('Settings | FAQ');
        window.scrollTo(0, 0);
    }, [])


    return (
        <div>
            <SettingsTitle title="Frequently Ask Questions" />
            <SimpleAccordion />
        </div>
    );
};

export default Faq;