/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import useFavoriteCompaniesStore, { getFavoriteCompany, searchFavCompany, selectFavoriteCompany } from '../../../app/stores/customer/favoriteCompaniesStore';
import { iFavCompanyGray, iWhitePlus } from '../../../app/utility/imageImports';
import CommonButton from '../../../components/button/CommonButton';
import CommonSearchBox from '../../../components/input/CommonSearchBox';
import CommonListItem from '../../../components/listItems/CommonListItem';
import CommonTitle from '../../../components/title/CommonTitle';
import FavoriteCompaniesDetails from './FavoriteCompaniesDetails';
import { useDebounce } from 'use-debounce';
import CommonEmptyData from '../../../components/emptyData/CommonEmptyData';
import { changePageTitle } from '../../../app/utility/utilityFunctions';

const FavoriteCompanies = () => {

    const { favoriteCompanyList, setShowAddFavoriteCompaniesModal, selectedFavId, searchValueFavoriteCompany, setSearchValueFavoriteCompany } = useFavoriteCompaniesStore();

    useEffect(() => {
        changePageTitle('Limadi | Favorite Companies');
        setSearchValueFavoriteCompany("");
        getFavoriteCompany();
    }, [])

    const [searchValue] = useDebounce(searchValueFavoriteCompany, 500);
    useEffect(() => {
        searchFavCompany(searchValue)
    }, [searchValue])


    return (
        <div>
            <div className=''>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:flex-wrap md:flex-nowrap'>
                    <CommonTitle title="Favorite Companies" count={favoriteCompanyList?.length} withReloader={true}
                        onReload={() => {
                            setSearchValueFavoriteCompany("");
                            getFavoriteCompany();
                        }} />
                    <div className='flex flex-col md:flex-row md:justify-between mt-s16 md:mt-0'>
                        <CommonSearchBox
                            value={searchValueFavoriteCompany}
                            onChange={(e) => { setSearchValueFavoriteCompany(e.target.value) }}
                        />
                        <div className='mt-s16 md:mt-0 md:ml-s10 '>
                            <CommonButton
                                onClick={() => {
                                    setShowAddFavoriteCompaniesModal(true)
                                }}
                                btnLabel='Add New'
                                icon={iWhitePlus}
                                width="w-[130px]" /></div>
                    </div>
                </div>

                {favoriteCompanyList?.length ? <div className="grid grid-cols-12 gap-2 mt-s20 md:gap-8 2xl:gap-8">
                    <div className="order-last col-span-12 lg:col-span-4 lg:order-first mt-s20 lg:mt-0">
                        <div className="flex-col">
                            {favoriteCompanyList?.map((item, index) => (
                                <div className='mb-s20'>
                                    <CommonListItem
                                        onClick={async () => {
                                            await selectFavoriteCompany(item, index)
                                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                                        }}
                                        imgCover={true}
                                        key={index}
                                        title={item?.name}
                                        subTitleOne={item?.address}
                                        subTitleTwo=""
                                        selected={item?.id === selectedFavId}
                                        withImage={true}
                                        imagePath={item?.image}
                                        imagePathDummy={iFavCompanyGray}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-8">
                        <div className="">
                            <FavoriteCompaniesDetails />
                        </div>
                    </div>
                </div> : <CommonEmptyData
                    title='No Favorite Companies Found !'
                    button={false}
                    details='There is no Favorite Companies available now.'
                />}

            </div>
        </div>
    );
};

export default FavoriteCompanies;