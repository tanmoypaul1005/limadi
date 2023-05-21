import { iAwardedNormal, iAwardedSelected, iBiddingNormal, iBiddingSelected, iCreateReqNormal, iCreateReqSelected, iFavAddressNormal, iFavAddressSelected, iFavCompanyNormal, iFavCompanySelected, iHistoryNormal, iHistorySelected, iHomeNormal, iHomeSelected, iOnGoingNormal, iOnGoingSelected, iReqNormal, iReqSelected, iSavedReqNormal, iSavedReqSelected, iSettingsNormal, iSettingsSelected } from "../../../app/utility/imageImports";

const CustomerSideBarList = [

    // home
    {
        onClick: () => { },
        title: "home",
        linkTo: "/",
        isActiveLink: "home",
        normalIcon: iHomeNormal,
        selectedIcon: iHomeSelected,
    },

    // request part (expandable)
    {
        onClick: () => { },
        title: "requests",

        isActiveLink: "expanded_bar",
        normalIcon: iReqNormal,
        selectedIcon: iReqSelected,
        expandedItems: [
            {
                title: "saved",
                link: "/requests/saved",
                normalIcon: iSavedReqNormal,
                selectedIcon: iSavedReqSelected,
                isActiveItem: false,
            },
            {
                title: "in bidding",
                link: "/requests/in-bidding",
                normalIcon: iBiddingNormal,
                selectedIcon: iBiddingSelected,
                isActiveItem: true,
            },
            {
                title: "awarded",
                link: "/requests/awarded",
                normalIcon: iAwardedNormal,
                selectedIcon: iAwardedSelected,
                isActiveItem: true,
            },
            {
                title: "on going",
                link: "/requests/on-going",
                normalIcon: iOnGoingNormal,
                selectedIcon: iOnGoingSelected,
                isActiveItem: true,
            },
            {
                title: "history",
                link: "/requests/history",
                normalIcon: iHistoryNormal,
                selectedIcon: iHistorySelected,
                isActiveItem: true,
            },
        ],
    },

    // create request
    {
        onClick: () => { },
        title: "create",
        linkTo: "/request/create",
        isActiveLink: "create",
        normalIcon: iCreateReqNormal,
        selectedIcon: iCreateReqSelected,
    },

    // fav companies
    {
        onClick: () => { },
        title: "Favorite Companies",
        linkTo: "/favorite-companies",
        isActiveLink: "favorite-companies",
        normalIcon: iFavCompanyNormal,
        selectedIcon: iFavCompanySelected,
    },

    // fav address
    {
        onClick: () => { },
        title: "Favorite Address",
        linkTo: "/favorite-address",
        isActiveLink: "favorite-address",
        normalIcon: iFavAddressNormal,
        selectedIcon: iFavAddressSelected,
    },

    // settings
    {
        onClick: () => { },
        title: "settings",
        linkTo: "/settings",
        isActiveLink: "settings",
        normalIcon: iSettingsNormal,
        selectedIcon: iSettingsSelected,
    },

    //    playground
    {
        onClick: () => { },
        title: "playground",
        linkTo: "/play",
        isActiveLink: "playground",
        normalIcon: iSettingsNormal,
        selectedIcon: iSettingsSelected,
    },
];

export default CustomerSideBarList;