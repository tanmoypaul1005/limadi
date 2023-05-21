import React from 'react';
import AddFavoriteAddressModal from '../../views/common/favoriteAddress/modal/AddFavoriteAddressModal';
import AddCarModal from '../../views/company/carManagement/modal/AddCarModal';
import EditCarModal from '../../views/company/carManagement/modal/EditCarModal';
import AddDriverModal from '../../views/company/driverManager/modal/AddDriverModal';
import FilterGlobalRequest from '../../views/company/globalRequest/components/modals/FilterGlobalRequest';
import AddShift from '../../views/company/shiftManager/components/Modal/AddShift';
import ConfirmDeleteShift from '../../views/company/shiftManager/components/Modal/ConfirmDeleteShift';
import EditShift from '../../views/company/shiftManager/components/Modal/EditShift';
import FilterShift from '../../views/company/shiftManager/components/Modal/FilterShift';
import AddFavoriteCompaniesModal from '../../views/customer/favoriteCompanies/modal/AddFavoriteCompaniesModal';
import ImageUploadViewModal from '../imageUpload/ImageUploadViewModal';
import RequestConfirmModal from '../../views/common/createRequest/components/RequestConfirmModal';
import EditCompanyPolicyModal from '../../views/common/settings/profile/modal/EditCompanyPolicyModal';
import EditCustomerProfileModal from '../../views/common/settings/profile/modal/EditCustomerProfileModal';
import CarDeleteModal from '../../views/company/carManagement/modal/CarDeleteModal';
import FavoriteAddressDeleteModal from '../../views/common/favoriteAddress/modal/FavoriteAddressDeleteModal';
import LogoutModal from '../modal/LogoutModal';
import DeleteAccountModal from '../../views/common/settings/profile/modal/DeleteAccountModal';
import EditAboutCompanyModal from '../../views/common/settings/profile/modal/EditAboutCompanyModal';
import EditFavoriteAddressModal from '../../views/common/favoriteAddress/modal/EditFavoriteAddressModal';
import CarLicensePackageModal from '../../views/company/carManagement/modal/CarLicensePackageModal';
import EditDriverModal from '../../views/company/driverManager/modal/EditDriverModal';
import DriverDeleteModal from '../../views/company/driverManager/modal/DriverDeleteModal';
import RemoveFavoriteCompanyModal from '../../views/customer/favoriteCompanies/modal/RemoveFavoriteCompanyModal';
import NotFavCompanyDetailsModal from '../../views/customer/favoriteCompanies/modal/NotFavCompanyDetailsModal';
import NotificationDetailsModal from '../../views/common/notification/modal/NotificationDetailsModal';

const CommonModalArea = () => {
    return (
        <div>
            {/* CommonModalArea */}

            <ImageUploadViewModal />
            <LogoutModal />

            {/* Notification Modal */}
            <NotificationDetailsModal />

            {/* FavoriteAddressModal */}
            <AddFavoriteAddressModal />
            <FavoriteAddressDeleteModal />
            <EditFavoriteAddressModal />

            {/*  Favorite Companies Modal */}
            <AddFavoriteCompaniesModal />

            {/* settings Modal */}
            <EditCustomerProfileModal />
            <EditCompanyPolicyModal />
            <DeleteAccountModal />
            <EditAboutCompanyModal />

            <RequestConfirmModal />


            {/* Favorite CompanyModal */}
            <RemoveFavoriteCompanyModal />
            <NotFavCompanyDetailsModal />


            {/********************** Company Modal Start ***********************/}

            {/* global_request_modals */}
            <FilterGlobalRequest />

            {/* car modals */}
            <AddCarModal />
            <CarLicensePackageModal />
            <EditCarModal />
            <CarDeleteModal />

            {/* driver modals */}
            <AddDriverModal />
            <EditDriverModal />
            <DriverDeleteModal />

            {/* shift modals */}
            <AddShift />
            <EditShift />
            <ConfirmDeleteShift />
            <FilterShift />



            {/********************** Company Modal End ***********************/}

        </div>
    )
}

export default CommonModalArea