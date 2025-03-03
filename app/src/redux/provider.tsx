"use client"

import { Provider } from "react-redux"
import { persistor, store } from "./store"
import { PersistGate } from "redux-persist/integration/react"
import Loading from "@/components/Loading"

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={<Loading />} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}
