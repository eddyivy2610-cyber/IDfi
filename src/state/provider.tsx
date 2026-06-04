// import { Provider } from "react-redux";
// import { persistor, store } from "./store";
// import { PersistGate } from "redux-persist/integration/react";

// export function AppProvider({ children }: { children: React.ReactNode }) {
//   return <PersistGate loading={null} persistor={persistor}>

//     <Provider store={store}>{children}</Provider>;
//   </PersistGate>
// }
"use client"

import type React from "react"

import { Provider } from "react-redux"
import { persistor, store } from "../state/store"
import { PersistGate } from "redux-persist/integration/react"

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
