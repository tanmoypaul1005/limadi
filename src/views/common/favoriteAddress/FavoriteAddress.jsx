/* eslint-disable react-hooks/exhaustive-deps */
import { useDebounce } from 'use-debounce';
import React, { useEffect } from 'react';
import useFavoriteAddressStore, { getFavoriteAddress, searchFavoriteAddress } from '../../../app/stores/others/favoriteAddressStore';
import { iWhitePlus } from '../../../app/utility/imageImports';
import { changePageTitle } from '../../../app/utility/utilityFunctions';
import CommonButton from '../../../components/button/CommonButton';
import CommonSearchBox from '../../../components/input/CommonSearchBox';
import CommonTitle from '../../../components/title/CommonTitle';
import FavoriteAddressList from './FavoriteAddressList';

const FavoriteAddress = () => {

    const {
        setShowAddFavoriteAddressModal,
        favoriteAddressList,
        favoriteAddressSearchValue,
        setFavoriteAddressSearchValue
    } = useFavoriteAddressStore();

    const [searchValue] = useDebounce(favoriteAddressSearchValue, 500);
    useEffect(() => {
        changePageTitle('Limadi | Favorite Address');
        setFavoriteAddressSearchValue("")
    }, [])

    useEffect(() => {
        searchFavoriteAddress(searchValue)
    }, [searchValue])

    return (
        <div>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:flex-wrap md:flex-nowrap'>

                <CommonTitle withReloader={true}
                    onReload={async () => {
                        await setFavoriteAddressSearchValue("")
                        await getFavoriteAddress();
                    }} title="Favorite Address" count={favoriteAddressList?.length} />

                <div className='flex flex-col md:flex-row md:justify-between mt-s16 md:mt-0'>
                    <CommonSearchBox
                        onChange={(e) => { setFavoriteAddressSearchValue(e.target.value) }}
                        name="searchKey"
                        value={favoriteAddressSearchValue}
                    />
                    <div className='mt-s16 md:mt-0 md:ml-s10'>
                        <CommonButton
                            onClick={() => { setShowAddFavoriteAddressModal(true) }}
                            btnLabel='Add New'
                            width="w-[130px]"
                            icon={iWhitePlus}
                        /></div>
                </div>
            </div>
            <FavoriteAddressList />
        </div>
    );
};

export default FavoriteAddress;