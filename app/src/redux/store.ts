import { contactInfoReducer } from "./features/contactInfo/reducer"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { authReducer } from "./features/auth/reducer"
import { countryReducer } from "./features/country/reducer"
import { districtReducer } from "./features/district/reducer"
import { factReducer } from "./features/fact/reducer"
import { memberReducer } from "./features/member/reducer"
import { permissionReducer } from "./features/permission/reducer"
import { productReducer } from "./features/product/reducer"
import { roleReducer } from "./features/role/reducer"
import { userReducer } from "./features/user/reducer"
import { factCategoryReducer } from "./features/factCategory/reducer"
import { BannerReducer } from "./features/banner/reducer"
import { memberDeviceReducer } from "./features/memberDevices/reducer"
import { settingReducer } from "./features/setting/reducer"
import { productCategoryReducer } from "./features/productCategory/reducer"
import { brandReducer } from "./features/brand/reducer"
import { regionReducer } from "./features/region/reducer"
import { deliveryReducer } from "./features/delivery/reducer"
import { companyReducer } from "./features/company/reducer"
import { newsReducer } from "./features/news/reducer"
import { storeReducer } from "./features/store/reducer"
import { foodCategoryReducer } from "./features/foodCategory/reducer"
import { foodReducer } from "./features/food/reducer"
import { invoiceFoodReducer } from "./features/invoiceFood/reducer"
import { invoiceProductReducer } from "./features/invoiceProduct/reducer"
import { eShopReducer } from "./features/eShop/reducer"

const authPersistConfig = {
    key: "root",
    storage: storage,
    whitelist: [""],
}

const rootReducer = combineReducers({
    auth: authReducer,
    country: countryReducer,
    role: roleReducer,
    user: userReducer,
    product: productReducer,
    member: memberReducer,
    district: districtReducer,
    region: regionReducer,
    delivery: deliveryReducer,
    fact: factReducer,
    permission: permissionReducer,
    factCategory: factCategoryReducer,
    banner: BannerReducer,
    memberDevice: memberDeviceReducer,
    setting: settingReducer,
    productCategory: productCategoryReducer,
    brand: brandReducer,
    company: companyReducer,
    news: newsReducer,
    store: storeReducer,
    contactInfo: contactInfoReducer,
    foodCategory: foodCategoryReducer,
    food: foodReducer,
    invoiceFood: invoiceFoodReducer,
    invoiceProduct: invoiceProductReducer,
    eShop: eShopReducer,
})

export const store = configureStore({
    reducer: persistReducer(authPersistConfig,rootReducer),
    devTools: process.env.NODE_ENV !== "production",
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
