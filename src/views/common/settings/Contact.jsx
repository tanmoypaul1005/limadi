import React, { useEffect } from 'react';
import useSettingsStore, { submitContactMessage } from '../../../app/stores/others/settingsStore';
import { changePageTitle } from '../../../app/utility/utilityFunctions';
import CommonButton from '../../../components/button/CommonButton';
import CommonInput from '../../../components/input/CommonInput';
import SettingsTitle from './SettingsTitle';

const Contact = () => {

    const { contactForm, setContactForm } = useSettingsStore();

    // const [marginCounter, setMarginCounter] = useState(3)

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setContactForm({ ...contactForm, [name]: value });
    };

    const submitContactLimadi = async (event) => {
        event.preventDefault()
        const contactSuccess = await submitContactMessage(contactForm)
        if (contactSuccess) {
            setContactForm({ message: "", subject: "" });
        }
    }

    useEffect(() => {
        changePageTitle('Settings || Contact');
    }, [])


    return (
        <div>
            <SettingsTitle title='Contact Limadi' />
            <form onSubmit={submitContactLimadi}>
                <div className='mb-s20'>
                    <CommonInput
                        value={contactForm?.subject}
                        name={'subject'}
                        type='text'
                        required={true}
                        labelText="Title"
                        onChange={handleChange}
                    />
                </div>
                <div className='h-max'>
                    <CommonInput
                        value={contactForm?.message}
                        name={'message'}
                        textarea={true}
                        type='text'
                        rows={5}
                        required={true}
                        labelText="Message"
                        onChange={(e) => {
                            handleChange(e);
                            // let t_counter = countNewLines(e.target.value);
                            // if (t_counter < 3) setMarginCounter(3);
                            // else if (t_counter > 4) setMarginCounter(4);
                            // else if (t_counter > 5) setMarginCounter(5);
                            // else setMarginCounter(t_counter);

                        }}
                    />
                </div>

                <div className='flex justify-end mt-s98'
                // style={{ marginTop: (marginCounter * 18.5) }}
                >
                    <CommonButton
                        isDisabled={contactForm?.subject && contactForm?.message ? false : true}
                        type='submit'
                        btnLabel='Submit' />
                </div>
            </form>
        </div>
    );
};

export default Contact;