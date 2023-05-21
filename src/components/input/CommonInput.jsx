/* eslint-disable react-hooks/exhaustive-deps */
import { TextField } from '@mui/material';
import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { iHidePass, iInformation, iShowPass } from '../../app/utility/imageImports';

// author: @zamanshahed

// use for normal text input field and textarea input field
// form validations are handleable by default way

const CommonInput = ({
    type = "text",                              //allowed types: text, password, email, number, 
    labelText = "__some input title__",         //enter a label string or enter empty string for no label
    value = "",
    onChange = () => { },
    name = null,
    onClick,
    max_input,
    min_input,
    is_readonly = false,
    className,
    classNameT,
    textarea = false,                           //if true, input field will be a textarea
    textareaWithoutBorderBottom = true,         //if true, input field will be a textarea
    rows = 3,
    max_rows = 5,
    togglePasswordBtn = false,                  //if true, toggle password hide/show button will be shown
    required = false,
    disabled = false,
    min = 0,
    max,
    autoFocus = false,
    multiline = true,
}) => {
    const [inputValue, setInputValue] = useState(value);
    const [inputOnFocus, setInputOnFocus] = useState(false);
    const [inputEmpty, setInputEmpty] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [inputType, setInputType] = useState(type);
    const [charCount, setCharCount] = useState(0);

    const [updatedRowCounter, setUpdatedRowCounter] = useState(3);

    // to validate numeric input length and force to stop input if limit exceeds
    const maxLengthCheck = (object) => {
        if (object.target.value.length > object.target.maxLength) {
            object.target.value = object.target.value.slice(0, object.target.maxLength)
        }
    }

    useEffect(() => {
        setInputValue(value);
        if (value) setInputEmpty(false);
        if (inputValue) setInputEmpty(false);
        else setInputEmpty(true);

        setCharCount(value?.length);
    }, [value, inputValue]);

    return (
        // ${textarea ? 'h-[90px]' : 'h-[48px] mt-s15'} 
        <div className={`relative bg-white w-full  mt-s15 ${className}`}>
            {<TextField
                id="standard-basic"
                variant="standard"
                label={type === "date" ? " " : labelText}
                onFocus={() => setInputOnFocus(true)}
                onBlur={() => setInputOnFocus(false)}
                onEmptied={() => setInputEmpty(true)}
                autoFocus={autoFocus}
                disabled={disabled}
                required={required}
                onClick={onClick}
                name={name}

                multiline={textarea ? multiline ?? true : false}
                minRows={rows ?? 3}
                maxRows={max_rows ?? 5}

                // data-date-format={type === "date" ? "DD MMMM YYYY" : ""}

                inputProps={{
                    readOnly: is_readonly,
                    maxLength: max_input ? max_input : textarea ? 500 : 4096,
                    minLength: min_input ? min_input : 0,
                    autoFocus: autoFocus,
                    min: min,
                    max: max,
                    // step: 3600,
                }}
                onKeyDown={(e) => {
                    if (type === "date") e.preventDefault();
                    if (type === 'number' && ["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                }}
                type={inputType}
                onInput={maxLengthCheck}
                value={inputValue}
                onChange={(e) => {
                    if (e.target.value.length) {
                        setInputEmpty(false);
                        setInputOnFocus(true);
                    }

                    setInputValue(e.target.value);
                    onChange(e);
                }}

                sx={{
                    // normal label color
                    "& label": {
                        color: '#89919E',
                        fontFamily: 'fEuclidLimadiRegular',
                        fontWeight: inputEmpty ? '' : 'normal',
                    },

                    //label color when input is focused
                    "& label.Mui-focused": {
                        color: '#89919E',
                        fontWeight: 'normal',
                    },

                    // focused color for input with variant='standard'
                    "& .MuiInput-underline:after": {
                        borderBottomColor: '#F89818',
                    },
                    // focused color for input with variant='filled'
                    "& .MuiFilledInput-underline:after": {
                        borderBottomColor: '#F89818',
                    },
                    // focused color for input with variant='outlined'
                    "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                            borderColor: '#F89818',
                        }
                    },
                    "& .MuiInputBase-input": {
                        fontSize: 14,
                        fontFamily: 'fEuclidLimadiRegular',
                        fontWeight: 'normal',
                    }
                }}

                className={`bg-transparent w-full pb-0 mb-0 ${className}`}
            />}

            {
                textarea ? <div className="absolute -bottom-[22px] right-0 ">
                    {charCount ?? 0} {max_input ? ("/" + max_input) : "/500"}
                </div>
                    : ""
            }

            {/* custom label for text area input */}
            {/* {textarea === true ? <div className={`absolute transition-all ease-in-out duration-300 cursor-text left-0 ${(inputOnFocus || !inputEmpty) ? "-top-0 text-[12px] text-[#89919E] font-normal" : "text-[#89919E] top-0 text-base pointer-events-none"} capitalize`}>{required ? labelText + "*" : labelText}</div> : ""} */}

            {/* password show/hide button */}
            {togglePasswordBtn || type === 'password' ? (
                <img
                    onClick={() => {
                        setShowPassword(!showPassword);
                        if (inputType === "password") {
                            setInputType("text");
                        } else {
                            setInputType("password");
                        }
                    }}
                    src={showPassword === true ? iShowPass : iHidePass}
                    alt="show-hide-icon"
                    className="absolute top-4 right-3 p-2 cursor-pointer"
                />
            ) : (
                ""
            )}

            {disabled === true ? (
                <Tooltip color={'#F89818'} title="Not Editable">
                    <img
                        src={iInformation}
                        alt="show-hide-icon"
                        className="absolute top-4 right-0 pl-2 pt-2 pb-2 cursor-pointer "
                    />
                </Tooltip>
            ) : (
                ""
            )}

            {/* {textarea ?
                <div className='relative'>
                    <textarea
                        onFocus={() => setInputOnFocus(true)}
                        onBlur={() => setInputOnFocus(false)}
                        onEmptied={() => setInputEmpty(true)}
                        autoFocus={autoFocus}

                        readOnly={is_readonly}
                        maxLength={max_input ? max_input : 500}
                        minLength={min_input ? min_input : 0}

                        disabled={disabled}
                        required={required}
                        onClick={onClick}
                        name={name}

                        rows={max_rows ? updatedRowCounter : rows}
                        className={`
                            outline-none w-full resize-none mt-5 text-sm
                            ${(inputOnFocus) ? "border-b-cBrand border-b-[2px]" : ""}
                            ${textareaWithoutBorderBottom ? "border-b-[1px] hover:border-b-[2px] border-gray-500" : "border-b-transparent"}
                            ${classNameT}
                        `}

                        onInput={maxLengthCheck}
                        value={inputValue}
                        onChange={(e) => {
                            let t_value = e.target.value;
                            let t_counter = countNewLines(t_value);

                            if (t_counter < 3) setUpdatedRowCounter(3);
                            else if (t_counter > max_rows) setUpdatedRowCounter(max_rows);
                            else setUpdatedRowCounter(t_counter);

                            // setUpdatedRowCounter(< 3 ? 3 : countNewLines(t_value));

                            if (e.target.value.length) {
                                setInputEmpty(false);
                                setInputOnFocus(true);
                            }
                            // console.log(e.target.value);
                            setCharCount(e.target.value.length);
                            setInputValue(e.target.value);
                            onChange(e);
                        }}
                    ></textarea>

                    <div className="absolute -bottom-5 right-0 ">
                        {charCount} {max_input ? ("/" + max_input) : "/500"}
                    </div>
                </div>
                : ""
            } */}
        </div>
    )
}

export default CommonInput

