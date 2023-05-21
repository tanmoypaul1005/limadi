/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import useFavoriteCompaniesStore, { addFavoriteCompany, getCompanyDetails, getNotFavoriteCompany } from '../../../../app/stores/customer/favoriteCompaniesStore';
import { iFavCompanyGray } from '../../../../app/utility/imageImports';
import CommonButton from '../../../../components/button/CommonButton';
import CommonSearchBox from '../../../../components/input/CommonSearchBox';
import CompanyListItem from '../../../../components/listItems/CompanyListItem';
import CommonModal from '../../../../components/modal/CommonModal';
import RatingChipContent from '../../../common/createRequest/components/content/selectCompany/components/RatingChipContent';

const AddFavoriteCompaniesModal = () => {

    let { setShowCompanyDetailsModal, searchRating, setSearchRating, selectedNotFavId, setShowAddFavoriteCompaniesModal, showAddFavoriteCompaniesModal, notFavoriteCompanyList, setSelectedNotFavId, searchValueNotFavoriteCompany, setSearchValueNotFavoriteCompany } = useFavoriteCompaniesStore();

    useEffect(() => {
        getNotFavoriteCompany();
        setSearchValueNotFavoriteCompany("")
    }, [])

    const [searchValue] = useDebounce(searchValueNotFavoriteCompany, 500);

    useEffect(() => {

        let stars = [];
        for (let i = searchRating; i <= 5; i++) {
            stars.push(i);
        }

        getNotFavoriteCompany(searchValue, stars);
    }, [searchValue, searchRating])

    return (
        <div>
            <CommonModal
                showModal={showAddFavoriteCompaniesModal}
                setShowModal={setShowAddFavoriteCompaniesModal}
                modalTitle="Add New Favorite Company"
                mainContent={
                    <>
                        <div className='mt-s20'>
                            <div className="w-full">
                                <CommonSearchBox
                                    name="searchKey"
                                    fullWidth={true}
                                    value={searchValueNotFavoriteCompany}
                                    onChange={(e) => { setSearchValueNotFavoriteCompany(e.target.value) }}
                                />
                            </div>
                            <div className='my-5 border-2 rounded-full py-s4 px-s16 w-fit' >
                                <RatingChipContent value={searchRating}
                                    onChange={(event, newValue) => {
                                        setSearchRating(newValue)
                                    }}
                                />
                            </div>

                            <div className='mb-s20 text-fs16 font-fw600'>Suggestion ( {notFavoriteCompanyList?.length} )</div>
                            <div className="grid grid-cols-2 gap-5 max-h-[300px] overflow-y-auto ">
                                {notFavoriteCompanyList?.length ?
                                    notFavoriteCompanyList?.map((item, index) => (
                                        <CompanyListItem
                                            key={index}
                                            index={index}
                                            title={item?.name}
                                            subTitleOne=""
                                            subTitleTwo=''
                                            rating={item?.rate ? item?.rate : 0}
                                            withCheckbox={true}
                                            withCloseIcon={true}
                                            selected={selectedNotFavId === item?.id}
                                            onSelect={() => { setSelectedNotFavId(item?.id) }}
                                            image={item?.image}
                                            dummyImage={iFavCompanyGray}
                                            onClick={async () => {
                                                await getCompanyDetails(item?.id, true);
                                                setShowCompanyDetailsModal(true)
                                            }}
                                        />
                                    ))
                                    : <div className='items-center text-xl '>
                                        <span>No Companies Found !</span>
                                    </div>}
                            </div>

                            <div className='flex justify-end mt-s20'>
                                <CommonButton
                                    isDisabled={selectedNotFavId ? false : true}
                                    onClick={async () => {
                                        const success = await addFavoriteCompany(true);
                                        if (success) {
                                            setSearchRating(0);
                                            setSearchValueNotFavoriteCompany("");
                                            setShowAddFavoriteCompaniesModal(false)
                                        }
                                    }}
                                    btnLabel='Add'
                                    width="w-[110px]" />
                            </div>
                        </div>
                    </>
                }

            />
        </div>
    );
};

export default AddFavoriteCompaniesModal;